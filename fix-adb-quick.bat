@echo off
echo ========================================
echo Quick ADB Fix - "Can't find service: package"
echo ========================================
echo.

set ANDROID_HOME=D:\Android\Sdk
set PATH=%PATH%;D:\Android\Sdk\platform-tools;D:\Android\Sdk\emulator

echo Killing ADB server...
adb kill-server
timeout /t 2 /nobreak >nul

echo Starting ADB server...
adb start-server
timeout /t 3 /nobreak >nul

echo Reconnecting to device...
adb reconnect
timeout /t 2 /nobreak >nul

echo.
echo Testing package manager...
adb shell pm list packages -3
echo.

if errorlevel 1 (
    echo ========================================
    echo FAILED - Package manager still broken
    echo ========================================
    echo.
    echo Try this manual fix:
    echo 1. Close Android emulator completely
    echo 2. Open Task Manager and kill any "qemu" processes
    echo 3. Restart emulator from Android Studio
    echo 4. Wait 30 seconds for full boot
    echo 5. Run this script again
    echo.
) else (
    echo ========================================
    echo SUCCESS - ADB fixed!
    echo ========================================
    echo.
    echo You can now:
    echo - Go back to Metro terminal
    echo - Press 'a' to launch on Android
    echo.
)

pause
