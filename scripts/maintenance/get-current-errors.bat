@echo off
setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║          Extract Current App Errors                           ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Set Android paths
set ANDROID_HOME=D:\Android\Sdk
set PATH=%PATH%;D:\Android\Sdk\platform-tools

REM Get emulator serial
for /f "tokens=1" %%a in ('adb devices ^| findstr "emulator"') do (
    set EMULATOR_SERIAL=%%a
    goto :found
)

echo [ERROR] No emulator detected!
pause
exit /b 1

:found
echo Extracting errors from: !EMULATOR_SERIAL!
echo.

REM Get recent logcat (last 500 lines)
echo Fetching recent logs...
adb -s !EMULATOR_SERIAL! logcat -d -t 500 > temp_logcat.txt

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo FATAL ERRORS:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
findstr /i "FATAL" temp_logcat.txt
if %errorlevel% neq 0 echo   (none)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo JAVASCRIPT ERRORS:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
findstr /i "ReactNativeJS ExceptionsManager" temp_logcat.txt
if %errorlevel% neq 0 echo   (none)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo GENERAL ERRORS:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
findstr /i /c:"E/" /c:"ERROR" temp_logcat.txt | findstr /v "ReactNativeJS FATAL"
if %errorlevel% neq 0 echo   (none)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo Full log saved to: temp_logcat.txt
echo.
echo To see more details, run:
echo   node analyze-android-errors.js
echo.
pause
