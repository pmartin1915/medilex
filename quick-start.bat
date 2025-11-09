@echo off
echo ========================================
echo Healthcare Vocab App - Quick Start
echo ========================================
echo.

REM Verify Android SDK is in path
where adb >nul 2>&1
if %errorlevel% neq 0 (
    echo Setting up Android SDK paths for this session...
    set ANDROID_HOME=D:\Android\Sdk
    set PATH=%PATH%;D:\Android\Sdk\platform-tools;D:\Android\Sdk\emulator
    echo.
    echo NOTE: For permanent fix, run: setup-android-env.bat
    echo.
)

echo Starting Expo development server...
echo.
echo After the QR code appears:
echo   - Press 'a' to open on Android emulator
echo   - Press 'w' to open in web browser
echo   - Scan QR code with Expo Go app on your phone
echo.
echo Make sure your Android emulator is running first!
echo If not, run: launch-emulator.bat in another terminal
echo.

npm start
