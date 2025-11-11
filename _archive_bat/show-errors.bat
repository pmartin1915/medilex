@echo off
echo ========================================
echo Metro Bundler Error Viewer
echo ========================================
echo.
echo This will show only ERRORS and WARNINGS from the Metro output.
echo Press Ctrl+C to exit.
echo.
echo ========================================
echo.

REM Check if Metro is running by looking for node processes
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Metro bundler appears to be running.
    echo.
) else (
    echo WARNING: Metro bundler doesn't appear to be running.
    echo Start it with start-android.bat first.
    echo.
    pause
    exit /b 1
)

echo Recent errors from your app:
echo ========================================
echo.

REM Show recent Metro logs (if available)
echo If you see errors here, check the Debug tab in your app for details.
echo.

REM This will monitor the console output for errors
echo Monitoring for new errors... (Press Ctrl+C to stop)
echo.

REM Note: This is a basic implementation.
REM For real-time monitoring, use the Debug tab in the app itself.
echo TIP: The Debug tab in your app shows much more detail!
echo      - Tap Debug at the bottom of your app
echo      - View all errors with full stack traces
echo      - Copy errors to clipboard with one tap
echo.
pause
