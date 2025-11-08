@echo off
echo ========================================
echo Android Connection Fix
echo ========================================
echo.

set ANDROID_HOME=D:\Android\Sdk
set PATH=%PATH%;D:\Android\Sdk\platform-tools;D:\Android\Sdk\emulator

echo [Step 1/5] Checking ADB status...
adb version
echo.

echo [Step 2/5] Killing existing ADB server...
adb kill-server
timeout /t 2 /nobreak >nul
echo.

echo [Step 3/5] Starting fresh ADB server...
adb start-server
timeout /t 3 /nobreak >nul
echo.

echo [Step 4/5] Listing connected devices...
adb devices -l
echo.

echo [Step 5/5] Checking if emulator is fully booted...
adb shell getprop sys.boot_completed
echo.

echo ========================================
echo Fix complete!
echo ========================================
echo.
echo If you see "1" above, emulator is ready.
echo If you see "error" or nothing, emulator is not ready.
echo.
echo Next steps:
echo 1. If emulator not ready, wait 30 seconds and run this again
echo 2. If ready, press 'a' in Metro terminal to try opening again
echo 3. Or run: npx expo start --android
echo.
pause
