<#
.SYNOPSIS
Deploys Medilex Android app using Expo Application Services (EAS)

.DESCRIPTION
Runs pre-deployment checks (tests, coverage), validates configuration, and builds
the Android app using EAS cloud builds. Supports production, preview, and development
build profiles.

.PARAMETER Profile
Build profile to use: production (AAB for Play Store), preview (APK for testing),
or development (dev client). Default: production

.PARAMETER SkipTests
Skip running tests for faster builds

.PARAMETER SkipCoverage
Skip coverage check for faster builds

.PARAMETER Wait
Wait for EAS build to complete (blocks until finished)

.PARAMETER AutoSubmit
Automatically submit to Google Play Store after successful build

.EXAMPLE
.\deploy-android.ps1
Runs all checks and builds production AAB (non-blocking)

.EXAMPLE
.\deploy-android.ps1 -Profile preview -SkipTests
Builds preview APK without running tests

.EXAMPLE
.\deploy-android.ps1 -Profile production -Wait -AutoSubmit
Builds production, waits for completion, and submits to Play Store

.NOTES
Requires: Expo account authentication (eas login)
Requires: EAS CLI (auto-installs if missing)
Build time: 5-20 minutes (cloud build)
Output: Build available via: eas build:download
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
$logFile = Initialize-DeploymentLog -ScriptName "deploy-android-medilex"
Write-DeploymentLog "Log file: $logFile" -Level Debug
Write-DeploymentLog "" -Level Info

# Display header
Write-DeploymentLog "=== Medilex - Android Deployment ===" -Level Info
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
Write-DeploymentLog "[$currentStep/$stepCount] Building Android app with EAS..." -Level Info
Write-DeploymentLog "Build profile: $Profile" -Level Info

# Show profile description
switch ($Profile) {
    "production" { Write-DeploymentLog "  Type: AAB (Android App Bundle for Play Store)" -Level Info }
    "preview" { Write-DeploymentLog "  Type: APK (Installable test build)" -Level Info }
    "development" { Write-DeploymentLog "  Type: Development client build" -Level Info }
}
Write-DeploymentLog "" -Level Info

# Build EAS command
$easArgs = "build --platform android --profile $Profile --non-interactive"
if ($Wait) {
    $easArgs += " --wait"
    Write-DeploymentLog "Wait mode: Script will block until build completes" -Level Info
} else {
    Write-DeploymentLog "Non-blocking: Build will continue in cloud" -Level Info
}

# Execute EAS build
Write-DeploymentLog "Executing: eas $easArgs" -Level Debug
Set-Location $appPath
eas build --platform android --profile $Profile --non-interactive $(if ($Wait) { "--wait" } else { "" })

if ($LASTEXITCODE -ne 0) {
    Write-DeploymentLog "EAS build failed with exit code $LASTEXITCODE" -Level Error
    exit 1
}

Write-DeploymentLog "EAS build submitted successfully" -Level Success
Write-DeploymentLog "" -Level Info

# Auto-submit if requested
if ($AutoSubmit -and $Profile -eq "production") {
    Write-DeploymentLog "Auto-submitting to Google Play Store..." -Level Info
    eas submit --platform android --non-interactive

    if ($LASTEXITCODE -eq 0) {
        Write-DeploymentLog "Submitted to Google Play Store successfully" -Level Success
    } else {
        Write-DeploymentLog "Submission failed - you may need to submit manually" -Level Warning
    }
    Write-DeploymentLog "" -Level Info
}

# Display completion message
Write-DeploymentLog "=== Android Build Complete ===" -Level Success
Write-DeploymentLog "" -Level Info

# Next steps
Write-DeploymentLog "Next steps:" -Level Info
if (-not $Wait) {
    Write-DeploymentLog "  - Monitor build: eas build:list" -Level Info
}
Write-DeploymentLog "  - Download build: eas build:download" -Level Info
if (-not $AutoSubmit -and $Profile -eq "production") {
    Write-DeploymentLog "  - Submit to Play Store: eas submit --platform android" -Level Info
}
Write-DeploymentLog "" -Level Info
Write-DeploymentLog "IMPORTANT: Medical terminology app - educational use only" -Level Warning
Write-DeploymentLog "" -Level Info
