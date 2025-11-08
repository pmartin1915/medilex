@echo off
REM ==============================================================================
REM list-emulators.bat - List all available Android Virtual Devices (AVDs)
REM ==============================================================================

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║          Available Android Emulators (AVDs)                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check if emulator is in PATH
where emulator >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] 'emulator' command not found!
    echo.
    echo The Android emulator is not in your PATH.
    echo.
    echo Please add the Android SDK emulator directory to your PATH:
    echo   Typical location: C:\Users\%USERNAME%\AppData\Local\Android\Sdk\emulator
    echo.
    echo Or set ANDROID_SDK_ROOT environment variable.
    echo.
    pause
    exit /b 1
)

echo Scanning for available Android Virtual Devices...
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

emulator -list-avds

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo To start an emulator, use:
echo   launch-emulator.bat [emulator-name]
echo.
echo Or manually:
echo   emulator @[emulator-name]
echo.
echo If no emulators are listed above, you need to create one in Android Studio:
echo   1. Open Android Studio
echo   2. Tools ^> Device Manager
echo   3. Create Device
echo   4. Choose a device definition (e.g., Pixel 5)
echo   5. Choose a system image (e.g., API 33)
echo   6. Finish setup
echo.
pause
