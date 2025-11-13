@echo off
setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║          Live Android Error Monitor                           ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo This will show errors in REAL-TIME as they occur in the app.
echo.
echo Press Ctrl+C to stop monitoring.
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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
echo.
echo Please start the emulator first.
pause
exit /b 1

:found
echo Monitoring: !EMULATOR_SERIAL!
echo.
echo Watching for:
echo   - FATAL errors (red)
echo   - JavaScript errors (red)
echo   - React Native errors (yellow)
echo   - General errors (yellow)
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Clear logcat first
adb -s !EMULATOR_SERIAL! logcat -c

REM Monitor logcat with filters
adb -s !EMULATOR_SERIAL! logcat -v time ^
  | findstr /i "FATAL ERROR Exception ReactNativeJS ExceptionsManager crash"
