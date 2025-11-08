@echo off
REM ==============================================================================
REM quick-start.bat - One-command startup for Healthcare Vocab App
REM ==============================================================================
REM This script:
REM   1. Checks if emulator is running
REM   2. Launches emulator if needed
REM   3. Waits for it to boot COMPLETELY
REM   4. Resets ADB to fix "device offline" issues
REM   5. Waits for package manager
REM   6. Starts the app with expo
REM ==============================================================================

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║     Healthcare Vocab App - Quick Start                        ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Set Android SDK paths
set ANDROID_HOME=D:\Android\Sdk
set PATH=%PATH%;D:\Android\Sdk\platform-tools;D:\Android\Sdk\emulator

echo [1/6] Resetting ADB connection...
echo.

REM Kill and restart ADB first to avoid connection issues
adb kill-server >nul 2>&1
timeout /t 1 /nobreak >nul
adb start-server >nul 2>&1
timeout /t 2 /nobreak >nul

echo ✓ ADB connection reset
echo.

echo [2/6] Checking if emulator is already running...
echo.

REM Check if any device is connected and online
adb devices | findstr "emulator.*device" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✓ Emulator is already running!
    echo.
    adb devices
    echo.
    goto :stabilize_connection
)

echo ⚠ No emulator detected. Launching emulator...
echo.

REM Launch emulator
echo [3/6] Starting Android emulator (Medium_Phone_API_36.1)...
echo.
echo This will open in a new window.
echo Please be patient - emulator boot takes 30-90 seconds.
echo.

start "Android Emulator" emulator -avd Medium_Phone_API_36.1 -no-snapshot-load

echo ✓ Emulator launch command sent!
echo.
echo [4/6] Waiting for emulator to boot...
echo      (This takes about 30-60 seconds)
echo.

REM Wait for device to appear in adb devices
set "WAIT_COUNT=0"
:wait_loop
timeout /t 3 /nobreak >nul
adb devices | findstr "emulator" >nul 2>&1
if %ERRORLEVEL% EQU 0 goto :check_boot_complete

set /a WAIT_COUNT+=1
if %WAIT_COUNT% LEQ 40 (
    echo      Waiting for emulator to appear... (%WAIT_COUNT%/40^)
    goto :wait_loop
)

echo.
echo [ERROR] Emulator took too long to appear in ADB.
echo Please check the emulator window and try again.
echo.
pause
exit /b 1

:check_boot_complete
REM Wait for boot to complete
echo.
echo ✓ Emulator detected! Waiting for boot to complete...
echo   (You should see the Android boot animation)
echo.

set "BOOT_COUNT=0"
:boot_loop
timeout /t 2 /nobreak >nul
adb shell getprop sys.boot_completed 2>nul | findstr "1" >nul 2>&1
if %ERRORLEVEL% EQU 0 goto :boot_done

set /a BOOT_COUNT+=1
if %BOOT_COUNT% LEQ 45 (
    echo      Booting... (%BOOT_COUNT%/45^)
    goto :boot_loop
)

echo.
echo [WARNING] Could not confirm boot completion after 90 seconds.
echo Proceeding anyway...
echo.

:boot_done
echo.
echo ✓ Emulator boot completed!
echo.

:stabilize_connection
echo [5/6] Stabilizing ADB connection...
echo      (Fixing "device offline" errors)
echo.

REM Reset ADB to fix offline issues
adb kill-server >nul 2>&1
timeout /t 1 /nobreak >nul
adb start-server >nul 2>&1
timeout /t 3 /nobreak >nul

REM Reconnect to device
adb reconnect >nul 2>&1
timeout /t 2 /nobreak >nul

REM Give package manager time to initialize
echo      Waiting for package manager to be ready...
timeout /t 5 /nobreak >nul

REM Test package manager
set "PM_COUNT=0"
:pm_loop
adb shell pm list packages -3 >nul 2>&1
if %ERRORLEVEL% EQU 0 goto :pm_ready

timeout /t 2 /nobreak >nul
set /a PM_COUNT+=1
if %PM_COUNT% LEQ 10 (
    echo      Package manager not ready yet... (%PM_COUNT%/10^)
    goto :pm_loop
)

echo.
echo [WARNING] Package manager not responding.
echo Proceeding anyway...
echo.

:pm_ready
echo.
echo ✓ ADB connection stable and package manager ready!
echo.

echo [6/6] Starting the Healthcare Vocab App...
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo Metro bundler will start below.
echo The app will build and install on the emulator.
echo.
echo WHAT TO EXPECT:
echo   1. "Building JavaScript bundle..." (30-60 seconds)
echo   2. "Launching com.healthcarevocabapp on Android..."
echo   3. App opens on the emulator!
echo.
echo FIRST TIME? The initial build takes 2-3 minutes.
echo.
echo For error monitoring, open a NEW terminal and run:
echo   monitor-app.bat
echo.
echo Press Ctrl+C to stop Metro when you're done.
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Start the app with expo
call npx expo start --android

endlocal
