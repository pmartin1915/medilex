@echo off
REM ==============================================================================
REM launch-emulator.bat - Launch an Android emulator
REM ==============================================================================
REM Usage: launch-emulator.bat [emulator-name]
REM If no name provided, launches Medium_Phone_API_36.1 (your default)
REM ==============================================================================

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║              Android Emulator Launcher                        ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Set Android SDK paths
set ANDROID_HOME=D:\Android\Sdk
set PATH=%PATH%;D:\Android\Sdk\platform-tools;D:\Android\Sdk\emulator

REM Check if emulator is in PATH
where emulator >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] 'emulator' command not found!
    echo.
    echo Please check that Android SDK is installed at: %ANDROID_HOME%
    echo.
    pause
    exit /b 1
)

echo Available emulators:
echo.
emulator -list-avds
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Use provided emulator name or default
if "%~1"=="" (
    set "AVD_NAME=Medium_Phone_API_36.1"
    echo Using default emulator: Medium_Phone_API_36.1
) else (
    set "AVD_NAME=%~1"
    echo Using specified emulator: %~1
)

echo.
echo Starting emulator: %AVD_NAME%
echo.
echo This will open in a new window.
echo Please wait 30-60 seconds for the emulator to fully boot.
echo.
echo Look for the Android home screen in the emulator window.
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Launch emulator in background
start "Android Emulator - %AVD_NAME%" emulator -avd %AVD_NAME% -no-snapshot-load

echo ✓ Emulator launch command sent!
echo.
echo Waiting 15 seconds for emulator to initialize...
timeout /t 15 /nobreak >nul

echo.
echo Checking emulator status...
adb devices
echo.

echo When you see the Android home screen in the emulator window,
echo you can run: start-android.bat
echo.
echo For autonomous testing workflow:
echo   1. Wait for home screen to appear
echo   2. Run: start-android.bat
echo   3. In another terminal: monitor-app.bat
echo.
pause
