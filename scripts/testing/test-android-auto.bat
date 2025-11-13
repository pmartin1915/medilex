@echo off
setlocal enabledelayedexpansion

REM ==============================================================================
REM test-android-auto.bat - Comprehensive Android Testing Automation
REM ==============================================================================
REM Features:
REM   - Automatic emulator detection and launch
REM   - Port conflict detection and resolution
REM   - Comprehensive error handling
REM   - Real-time status monitoring
REM   - Automatic app installation and launch
REM   - Error log extraction
REM ==============================================================================

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║        Medilex - Automated Android Testing System             ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM ==============================================================================
REM STEP 1: Environment Setup
REM ==============================================================================

echo [1/8] Setting up Android environment...

set ANDROID_HOME=D:\Android\Sdk
set PATH=%PATH%;D:\Android\Sdk\platform-tools;D:\Android\Sdk\emulator;D:\Android\Sdk\tools\bin

REM Verify Android SDK exists
if not exist "%ANDROID_HOME%" (
    echo.
    echo [ERROR] Android SDK not found at: %ANDROID_HOME%
    echo.
    echo Please install Android SDK or update ANDROID_HOME path in this script.
    echo.
    pause
    exit /b 1
)

echo   ✓ Android SDK found: %ANDROID_HOME%

REM Verify ADB is accessible
where adb >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] ADB not found in PATH!
    echo.
    echo Please run: setup-android-env.bat
    echo.
    pause
    exit /b 1
)

echo   ✓ ADB accessible
echo.

REM ==============================================================================
REM STEP 2: Port Conflict Detection
REM ==============================================================================

echo [2/8] Checking for port conflicts...

REM Check if Metro bundler port (8081) is in use
netstat -ano | findstr ":8081" >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo [WARNING] Port 8081 is already in use!
    echo.
    echo Attempting to free port 8081...
    
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8081"') do (
        set PID=%%a
        REM Don't kill if it's the system process (PID 4) or our own process
        if not "!PID!"=="4" if not "!PID!"=="%PID%" (
            echo   Killing process !PID! on port 8081...
            taskkill /F /PID !PID! >nul 2>&1
        )
    )
    
    timeout /t 2 /nobreak >nul
    
    REM Verify port is now free
    netstat -ano | findstr ":8081" >nul 2>&1
    if %errorlevel% equ 0 (
        echo   [WARNING] Port 8081 still in use, but continuing...
    ) else (
        echo   ✓ Port 8081 freed successfully
    )
) else (
    echo   ✓ Port 8081 is available
)

REM Check ADB port (5037)
netstat -ano | findstr ":5037" >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✓ ADB server is running
) else (
    echo   ℹ ADB server not running (will start automatically)
)

echo.

REM ==============================================================================
REM STEP 3: ADB Server Management
REM ==============================================================================

echo [3/8] Managing ADB server...

echo   Restarting ADB server for clean state...
adb kill-server >nul 2>&1
timeout /t 1 /nobreak >nul

adb start-server >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to start ADB server!
    echo.
    pause
    exit /b 1
)

timeout /t 2 /nobreak >nul
echo   ✓ ADB server restarted successfully
echo.

REM ==============================================================================
REM STEP 4: Emulator Detection and Launch
REM ==============================================================================

echo [4/8] Detecting Android emulators...

REM Check if emulator is already running
adb devices | findstr "emulator" >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✓ Emulator already running
    
    REM Get emulator serial
    for /f "tokens=1" %%a in ('adb devices ^| findstr "emulator"') do (
        set EMULATOR_SERIAL=%%a
    )
    
    echo   Device: !EMULATOR_SERIAL!
    goto :emulator_ready
)

echo   No running emulator detected

REM List available AVDs
echo.
echo   Available emulators:
emulator -list-avds 2>nul | findstr /r "." >nul
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] No Android emulators found!
    echo.
    echo Please create an emulator in Android Studio:
    echo   1. Open Android Studio
    echo   2. Tools ^> Device Manager
    echo   3. Create Device
    echo.
    pause
    exit /b 1
)

REM Get first available AVD
for /f "delims=" %%a in ('emulator -list-avds 2^>nul') do (
    set AVD_NAME=%%a
    goto :avd_found
)

:avd_found
echo   Found AVD: %AVD_NAME%
echo.
echo   Launching emulator: %AVD_NAME%
echo   (This will open in a new window)
echo.

REM Launch emulator in background
start "Android Emulator" /MIN emulator -avd %AVD_NAME% -no-snapshot-load -no-boot-anim

echo   Waiting for emulator to boot (this may take 30-60 seconds)...
echo.

REM Wait for emulator to appear in adb devices
set WAIT_COUNT=0
:wait_for_emulator
timeout /t 3 /nobreak >nul
adb devices | findstr "emulator" >nul 2>&1
if %errorlevel% neq 0 (
    set /a WAIT_COUNT+=1
    if !WAIT_COUNT! gtr 20 (
        echo.
        echo [ERROR] Emulator failed to start after 60 seconds!
        echo.
        echo Please check:
        echo   1. Android Studio is not blocking the emulator
        echo   2. Virtualization is enabled in BIOS
        echo   3. Emulator window opened successfully
        echo.
        pause
        exit /b 1
    )
    echo   Still waiting... (!WAIT_COUNT!/20)
    goto :wait_for_emulator
)

REM Get emulator serial
for /f "tokens=1" %%a in ('adb devices ^| findstr "emulator"') do (
    set EMULATOR_SERIAL=%%a
)

echo   ✓ Emulator detected: !EMULATOR_SERIAL!

:emulator_ready

REM Wait for boot to complete
echo.
echo   Waiting for emulator to fully boot...

set BOOT_WAIT=0
:wait_for_boot
adb -s !EMULATOR_SERIAL! shell getprop sys.boot_completed 2>nul | findstr "1" >nul
if %errorlevel% neq 0 (
    set /a BOOT_WAIT+=1
    if !BOOT_WAIT! gtr 30 (
        echo.
        echo [WARNING] Boot completion timeout, but continuing...
        goto :boot_done
    )
    timeout /t 2 /nobreak >nul
    goto :wait_for_boot
)

:boot_done
echo   ✓ Emulator fully booted
echo.

REM ==============================================================================
REM STEP 5: Package Manager Verification
REM ==============================================================================

echo [5/8] Verifying package manager service...

adb -s !EMULATOR_SERIAL! shell pm list packages >nul 2>&1
if %errorlevel% neq 0 (
    echo   [WARNING] Package manager not responding
    echo   Attempting reconnect...
    
    adb reconnect >nul 2>&1
    timeout /t 2 /nobreak >nul
    
    adb -s !EMULATOR_SERIAL! shell pm list packages >nul 2>&1
    if %errorlevel% neq 0 (
        echo   [ERROR] Package manager still not responding!
        echo.
        echo   Please restart the emulator and try again.
        echo.
        pause
        exit /b 1
    )
    echo   ✓ Package manager OK after reconnect
) else (
    echo   ✓ Package manager service operational
)

echo.

REM ==============================================================================
REM STEP 6: Clear Metro Cache
REM ==============================================================================

echo [6/8] Clearing Metro bundler cache...

if exist "node_modules\.cache" (
    echo   Removing node_modules\.cache...
    rmdir /s /q "node_modules\.cache" >nul 2>&1
)

if exist ".expo" (
    echo   Clearing .expo cache...
    rmdir /s /q ".expo" >nul 2>&1
)

echo   ✓ Cache cleared
echo.

REM ==============================================================================
REM STEP 7: Start Metro Bundler
REM ==============================================================================

echo [7/8] Starting Metro bundler...
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    Metro Bundler Starting                      ║
echo ╠════════════════════════════════════════════════════════════════╣
echo ║  The app will install automatically on the emulator            ║
echo ║  Watch for errors in the output below                          ║
echo ║  Press Ctrl+C to stop when done testing                        ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo   Emulator: !EMULATOR_SERIAL!
echo   Port: 8081
echo   Mode: Development
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Start Metro with Android target
npx expo start --clear --android

REM ==============================================================================
REM STEP 8: Cleanup (runs after Ctrl+C)
REM ==============================================================================

echo.
echo.
echo [8/8] Cleaning up...
echo.

REM Extract errors from logcat
echo Extracting error logs from device...
adb -s !EMULATOR_SERIAL! logcat -d | findstr /i "error exception crash" > android-test-errors.log 2>&1

if exist "android-test-errors.log" (
    for %%A in ("android-test-errors.log") do set SIZE=%%~zA
    if !SIZE! gtr 0 (
        echo   ⚠ Errors detected - saved to: android-test-errors.log
        echo.
        echo   First 10 errors:
        echo   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        type android-test-errors.log | more +1 | findstr /n "^" | findstr "^[1-9]:" | findstr /v "^[1-9][0-9]:"
        echo   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    ) else (
        echo   ✓ No errors detected
        del android-test-errors.log >nul 2>&1
    )
)

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    Testing Session Complete                    ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Summary:
echo   - Emulator: !EMULATOR_SERIAL!
echo   - App tested on Android
echo   - Logs: Check android-test-errors.log if errors occurred
echo.
echo Next steps:
echo   - Review any errors in android-test-errors.log
echo   - Check app Debug tab for detailed error logs
echo   - Run verification checklist: VERIFICATION-CHECKLIST.md
echo.

pause
