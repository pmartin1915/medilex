<#
.SYNOPSIS
Deploys Medilex iOS app using Expo Application Services (EAS)

.DESCRIPTION
Runs pre-deployment checks (tests, coverage), validates configuration, and builds
the iOS app using EAS cloud builds. Supports production, preview, and development
build profiles.

.PARAMETER Profile
Build profile to use: production (archive for App Store), preview (TestFlight),
or development (dev client). Default: production

.PARAMETER SkipTests
Skip running tests for faster builds

.PARAMETER SkipCoverage
Skip coverage check for faster builds

.PARAMETER Wait
Wait for EAS build to complete (blocks until finished)

.PARAMETER AutoSubmit
Automatically submit to Apple App Store after successful build

.EXAMPLE
.\deploy-ios.ps1
Runs all checks and builds production archive (non-blocking)

.EXAMPLE
.\deploy-ios.ps1 -Profile preview -SkipTests
Builds preview for TestFlight without running tests

.EXAMPLE
.\deploy-ios.ps1 -Profile production -Wait -AutoSubmit
Builds production, waits for completion, and submits to App Store

.NOTES
Requires: Expo account authentication (eas login)
Requires: EAS CLI (auto-installs if missing)
Requires: Apple Developer account for production builds
Build time: 15-30 minutes (cloud build)
Output: Build available via: eas build:download
Note: iOS builds can be created on Windows via EAS (unlike Capacitor)
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [ValidateSet("production", "preview", "development")]
    [string]$Profile = "production",

    [Parameter(Mandatory = $false)]
    [switch]$SkipTests,

    [Parameter(Mandatory = $false)]
    [switch]$SkipCoverage,

    [Parameter(Mandatory = $false)]
    [switch]$Wait,

    [Parameter(Mandatory = $false)]
    [switch]$AutoSubmit
)

# Import shared deployment module
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$commonModulePath = Join-Path (Split-Path (Split-Path $scriptPath -Parent) -Parent) "scripts\deployment-common.psm1"
Import-Module $commonModulePath -Force

# Initialize logging
$logFile = Initialize-DeploymentLog -ScriptName "deploy-ios-medilex"
Write-DeploymentLog "Log file: $logFile" -Level Debug
Write-DeploymentLog "" -Level Info

# Display header
Write-DeploymentLog "=== Medilex - iOS Deployment ===" -Level Info
Write-DeploymentLog "Profile: $Profile" -Level Info
Write-DeploymentLog "" -Level Info

# Load configuration
$appConfig = Get-AppConfig -AppName "Medilex"
$appPath = Join-Path (Split-Path $scriptPath -Parent) ""

# Calculate step count
$stepCount = 4  # Base: tools, tests, config, build
if (-not $SkipCoverage) { $stepCount++ }
$currentStep = 0

# Step 1: Validate required tools
$currentStep++
Write-DeploymentLog "[$currentStep/$stepCount] Validating required tools..." -Level Info
$requiredTools = @("eas", "npm")
if (-not (Test-RequiredTools -Tools $requiredTools -AppName "Medilex")) {
    Write-DeploymentLog "Attempting to install EAS CLI..." -Level Info
    npm install -g eas-cli
    if ($LASTEXITCODE -ne 0) {
        Write-DeploymentLog "Failed to install EAS CLI" -Level Error
        exit 1
    }
    Write-DeploymentLog "EAS CLI installed successfully" -Level Success
}
Write-DeploymentLog "All required tools available" -Level Success
Write-DeploymentLog "" -Level Info

# Step 2: Run tests
if (-not $SkipTests) {
    $currentStep++
    Write-DeploymentLog "[$currentStep/$stepCount] Running tests..." -Level Info
    $testsPassed = Test-AppTests -AppName "Medilex"
    if (-not $testsPassed) {
        Write-DeploymentLog "Tests failed" -Level Error
        exit 1
    }
    Write-DeploymentLog "" -Level Info
}

# Step 3: Run coverage check
if (-not $SkipCoverage) {
    $currentStep++
    Write-DeploymentLog "[$currentStep/$stepCount] Running coverage check..." -Level Info
    $coveragePassed = Test-Coverage -AppName "Medilex"
    if (-not $coveragePassed) {
        Write-DeploymentLog "Coverage threshold not met" -Level Error
        exit 1
    }
    Write-DeploymentLog "" -Level Info
}

# Step 4: Validate Expo configuration
$currentStep++
Write-DeploymentLog "[$currentStep/$stepCount] Validating Expo configuration..." -Level Info
$appJsonPath = Join-Path $appPath "app.json"
if (-not (Test-Path $appJsonPath)) {
    Write-DeploymentLog "app.json not found at: $appJsonPath" -Level Error
    exit 1
}
Write-DeploymentLog "Expo configuration found" -Level Success
Write-DeploymentLog "" -Level Info

# Step 5: Build with EAS
$currentStep++
Write-DeploymentLog "[$currentStep/$stepCount] Building iOS app with EAS..." -Level Info
Write-DeploymentLog "Build profile: $Profile" -Level Info

# Show profile description
switch ($Profile) {
    "production" { Write-DeploymentLog "  Type: Archive (for App Store submission)" -Level Info }
    "preview" { Write-DeploymentLog "  Type: TestFlight build (internal testing)" -Level Info }
    "development" { Write-DeploymentLog "  Type: Development client build" -Level Info }
}
Write-DeploymentLog "" -Level Info

# Build EAS command
$easArgs = "build --platform ios --profile $Profile --non-interactive"
if ($Wait) {
    $easArgs += " --wait"
    Write-DeploymentLog "Wait mode: Script will block until build completes (15-30 min)" -Level Info
} else {
    Write-DeploymentLog "Non-blocking: Build will continue in cloud" -Level Info
}

# Execute EAS build
Write-DeploymentLog "Executing: eas $easArgs" -Level Debug
Set-Location $appPath
eas build --platform ios --profile $Profile --non-interactive $(if ($Wait) { "--wait" } else { "" })

if ($LASTEXITCODE -ne 0) {
    Write-DeploymentLog "EAS build failed with exit code $LASTEXITCODE" -Level Error
    exit 1
}

Write-DeploymentLog "EAS build submitted successfully" -Level Success
Write-DeploymentLog "" -Level Info

# Auto-submit if requested
if ($AutoSubmit -and $Profile -eq "production") {
    Write-DeploymentLog "Auto-submitting to Apple App Store..." -Level Info
    eas submit --platform ios --non-interactive

    if ($LASTEXITCODE -eq 0) {
        Write-DeploymentLog "Submitted to Apple App Store successfully" -Level Success
    } else {
        Write-DeploymentLog "Submission failed - you may need to submit manually" -Level Warning
    }
    Write-DeploymentLog "" -Level Info
}

# Display completion message
Write-DeploymentLog "=== iOS Build Complete ===" -Level Success
Write-DeploymentLog "" -Level Info

# Next steps
Write-DeploymentLog "Next steps:" -Level Info
if (-not $Wait) {
    Write-DeploymentLog "  - Monitor build: eas build:list" -Level Info
}
Write-DeploymentLog "  - Download build: eas build:download" -Level Info
if (-not $AutoSubmit -and $Profile -eq "production") {
    Write-DeploymentLog "  - Submit to App Store: eas submit --platform ios" -Level Info
}
Write-DeploymentLog "" -Level Info
Write-DeploymentLog "IMPORTANT: Medical terminology app - educational use only" -Level Warning
Write-DeploymentLog "" -Level Info
