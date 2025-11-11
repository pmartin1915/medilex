@echo off
REM ==============================================================================
REM check-app-status.bat - Quick health check for Healthcare Vocab App
REM ==============================================================================
REM Claude can run this to quickly verify app status without user intervention
REM ==============================================================================

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║           Healthcare Vocab App - Status Check                 ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check 1: ADB connectivity
echo [1/5] Checking ADB...
where adb >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   ✓ ADB is installed
) else (
    echo   ✗ ADB not found
    echo   Install Android SDK Platform-Tools
    exit /b 1
)

REM Check 2: Device connection
echo [2/5] Checking device connection...
adb devices | findstr "emulator device" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   ✓ Device connected
    for /f "tokens=*" %%a in ('adb devices ^| findstr "emulator device"') do (
        echo     → %%a
    )
) else (
    echo   ✗ No device connected
    echo   Run: emulator @your_avd_name
    exit /b 1
)

REM Check 3: Metro bundler
echo [3/5] Checking Metro bundler...
curl -s http://localhost:8081/status | findstr "packager-status:running" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   ✓ Metro bundler is running
) else (
    echo   ⚠ Metro bundler not detected
    echo     This might be OK if running in production mode
)

REM Check 4: Recent errors in logcat
echo [4/5] Checking for recent errors...
adb logcat -d -v time | findstr /I "VOCAB_APP_ERROR Exception FATAL" > %TEMP%\recent_errors.txt 2>nul
for /f %%a in ('type %TEMP%\recent_errors.txt 2^>nul ^| find /c /v ""') do set ERROR_COUNT=%%a

if "%ERROR_COUNT%"=="0" (
    echo   ✓ No recent errors found
) else (
    echo   ⚠ Found %ERROR_COUNT% potential error^(s^) in recent logs
    echo     Recent errors:
    for /f "tokens=*" %%a in ('type %TEMP%\recent_errors.txt ^| more +1 ^| more +2') do (
        echo     %%a
    )
)

REM Check 5: App-specific logs
echo [5/5] Checking app-specific logs...
adb logcat -d | findstr "VOCAB_APP_ERROR" > %TEMP%\app_errors.txt 2>nul
for /f %%a in ('type %TEMP%\app_errors.txt 2^>nul ^| find /c /v ""') do set APP_ERROR_COUNT=%%a

if "%APP_ERROR_COUNT%"=="0" (
    echo   ✓ No app-specific errors logged
) else (
    echo   ℹ Found %APP_ERROR_COUNT% app error log^(s^)
    echo     Most recent app error:
    for /f "tokens=*" %%a in ('type %TEMP%\app_errors.txt') do (
        set LAST_ERROR=%%a
    )
    echo     !LAST_ERROR!
)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 📊 Summary
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

if "%ERROR_COUNT%"=="0" (
    echo ✓ App appears healthy!
    echo.
    echo Next steps for Claude:
    echo   • Run monitor-app.bat to watch real-time logs
    echo   • Run node extract-errors.js for detailed error analysis
    echo   • Make code changes and test immediately
) else (
    echo ⚠ Issues detected - review errors above
    echo.
    echo Debugging tools:
    echo   • Run monitor-app.bat for real-time monitoring
    echo   • Run node extract-errors.js for error extraction
    echo   • Check the Debug tab in the app
)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Clean up
del %TEMP%\recent_errors.txt 2>nul
del %TEMP%\app_errors.txt 2>nul
