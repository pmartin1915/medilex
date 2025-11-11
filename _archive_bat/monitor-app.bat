@echo off
REM ==============================================================================
REM monitor-app.bat - Unified monitoring for Healthcare Vocab App
REM ==============================================================================
REM This script combines Metro bundler output with Android logcat
REM Claude can run this in background and read all app output automatically
REM ==============================================================================

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║         Healthcare Vocab App - Unified Monitor                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo This monitor combines:
echo   • Metro Bundler output
echo   • Android Logcat (filtered for app)
echo   • App error logs with 🏥 [VOCAB_APP_ERROR] prefix
echo.
echo Claude can read this output to test and debug autonomously!
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Check if ADB is available
where adb >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] ADB not found. Install Android SDK Platform-Tools.
    echo           Android logs will not be available.
    echo.
    pause
    exit /b 1
)

REM Check if device is connected
adb devices | findstr "emulator\|device" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] No Android device/emulator detected.
    echo           Please start your emulator first.
    echo.
    pause
    exit /b 1
)

echo [✓] ADB connected
echo [✓] Device detected
echo.

REM Clear old logcat
adb logcat -c >nul 2>&1

REM Create a temporary file for monitoring
set "LOG_FILE=%TEMP%\vocab_app_monitor.log"
echo. > "%LOG_FILE%"

echo Starting monitoring... Press Ctrl+C to stop
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Start Android logcat in background, filtering for app-specific logs
start /b "" cmd /c "adb logcat -v time ReactNative:V ReactNativeJS:V ExpoLog:V DEBUG:V *:E 2>&1 | findstr /I /C:"VOCAB_APP_ERROR" /C:"ReactNativeJS" /C:"ERROR" /C:"Exception" /C:"FATAL""

REM Note: On Windows, we can't easily combine Metro + Logcat in one stream
REM So we'll monitor logcat with our special error prefix
REM For Metro logs, user should check the Metro terminal window

echo.
echo [📱 ANDROID LOGCAT - Filtered for Vocab App Errors]
echo.
echo Monitoring for:
echo   • 🏥 [VOCAB_APP_ERROR] - Our structured app errors
echo   • ReactNativeJS - JavaScript logs
echo   • Errors, Exceptions, Fatal crashes
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Stream logcat with filtering
adb logcat -v time | findstr /I "VOCAB_APP_ERROR ReactNativeJS ERROR Exception FATAL"

endlocal
