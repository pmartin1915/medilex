@echo off
echo ========================================
echo Launch Android Emulator
echo ========================================
echo.

set ANDROID_HOME=D:\Android\Sdk
set PATH=%PATH%;D:\Android\Sdk\platform-tools;D:\Android\Sdk\emulator

echo Available emulators:
echo.
emulator -list-avds
echo.

echo Launching Medium_Phone_API_36.1...
echo.
echo NOTE: Emulator will open in a new window.
echo Wait for it to fully boot (you'll see the home screen).
echo Then run: start-android.bat
echo.

start emulator -avd Medium_Phone_API_36.1 -no-snapshot-load

echo.
echo Emulator is starting...
echo Waiting 10 seconds before checking status...
timeout /t 10 /nobreak >nul

echo.
echo Checking emulator status...
adb devices
echo.

echo When you see the Android home screen, the emulator is ready.
echo Then you can run: start-android.bat
echo.
pause
