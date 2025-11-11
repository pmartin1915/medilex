@echo off
REM ==============================================================================
REM read-app-logs.bat - Real-time Android logcat monitoring for Healthcare Vocab App
REM ==============================================================================
REM This script monitors Android logcat and filters for app-specific logs
REM Claude can run this to read app output directly without manual copy/paste
REM ==============================================================================

echo.
echo ================================
echo  App Log Monitor (Android)
echo ================================
echo.
echo Starting real-time log monitoring...
echo Press Ctrl+C to stop
echo.
echo Filtering for:
echo   - ReactNative logs
echo   - JavaScript errors
echo   - App crashes
echo   - Custom app logs
echo.
echo ================================
echo.

REM Clear old logs first
adb logcat -c

REM Monitor logs with filters for React Native and JavaScript
REM -v time = show timestamps
REM -s = silent mode (only show specified tags)
adb logcat -v time ^
  ReactNative:V ^
  ReactNativeJS:V ^
  ExpoLog:V ^
  Expo:V ^
  AndroidRuntime:E ^
  DEBUG:V ^
  *:E

REM Alternative: Use grep-like filtering (if the above doesn't work)
REM adb logcat -v time | findstr /I "ReactNative ExpoLog Error Exception"
