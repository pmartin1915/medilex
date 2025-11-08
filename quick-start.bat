@echo off
REM ==============================================================================
REM quick-start.bat - One-command startup for Healthcare Vocab App
REM ==============================================================================
REM This script:
REM   1. Checks if emulator is running
REM   2. Launches emulator if needed
REM   3. Waits for it to boot
REM   4. Starts the app with expo
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

echo [1/4] Checking if emulator is already running...
echo.

REM Check if any device is connected
adb devices | findstr "emulator\|device" | findstr /v "List" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✓ Emulator is already running!
    echo.
    for /f "tokens=*" %%a in ('adb devices ^| findstr "emulator\|device" ^| findstr /v "List"') do (
        echo   → %%a
    )
    echo.
    goto :start_app
)

echo ⚠ No emulator detected. Launching emulator...
echo.

REM Launch emulator
echo [2/4] Starting Android emulator (Medium_Phone_API_36.1)...
echo.
echo This will open in a new window.
echo.

start "Android Emulator" emulator -avd Medium_Phone_API_36.1 -no-snapshot-load

echo ✓ Emulator launch command sent!
echo.
echo [3/4] Waiting for emulator to boot completely...
echo      This usually takes 30-60 seconds.
echo.

REM Wait for device to be connected (not just listed)
set "WAIT_COUNT=0"
:wait_loop
timeout /t 3 /nobreak >nul
adb devices | findstr "emulator.*device" >nul 2>&1
if %ERRORLEVEL% EQU 0 goto :check_boot_complete

set /a WAIT_COUNT+=1
if %WAIT_COUNT% LEQ 40 (
    echo      Still waiting... (%WAIT_COUNT%/40^)
    goto :wait_loop
)

echo.
echo [ERROR] Emulator took too long to start.
echo Please check the emulator window and try again.
echo.
pause
exit /b 1

:check_boot_complete
REM Wait for boot to complete
echo.
echo ✓ Emulator detected! Waiting for boot to complete...
echo.

set "BOOT_COUNT=0"
:boot_loop
timeout /t 2 /nobreak >nul
adb shell getprop sys.boot_completed 2>nul | findstr "1" >nul 2>&1
if %ERRORLEVEL% EQU 0 goto :boot_done

set /a BOOT_COUNT+=1
if %BOOT_COUNT% LEQ 30 (
    echo      Booting... (%BOOT_COUNT%/30^)
    goto :boot_loop
)

echo.
echo [WARNING] Could not confirm boot completion.
echo The emulator might still be booting.
echo Proceeding anyway...
echo.

:boot_done
echo.
echo ✓ Emulator is ready!
echo.

:start_app
echo [4/4] Starting the Healthcare Vocab App...
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo Metro bundler will start below.
echo The app will install and launch on the emulator.
echo.
echo For monitoring errors, open a NEW terminal and run:
echo   monitor-app.bat
echo.
echo Press Ctrl+C to stop the app server.
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Start the app
call npm run android

endlocal
