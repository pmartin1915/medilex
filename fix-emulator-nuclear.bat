@echo off
echo ========================================
echo NUCLEAR FIX - Restart Package Manager
echo ========================================
echo.

set ANDROID_HOME=D:\Android\Sdk
set PATH=%PATH%;D:\Android\Sdk\platform-tools;D:\Android\Sdk\emulator

echo This will restart the Android system services.
echo The emulator screen may flicker or go black briefly.
echo.
pause

echo.
echo [1/6] Killing ADB server...
adb kill-server
timeout /t 2 /nobreak >nul

echo [2/6] Starting ADB server...
adb start-server
timeout /t 3 /nobreak >nul

echo [3/6] Checking device...
adb devices
echo.

echo [4/6] Restarting Android system server (this fixes package manager)...
echo This will cause the emulator to restart system services.
echo.
adb shell "su 0 stop && su 0 start" 2>nul
if errorlevel 1 (
    echo System server restart requires root - trying alternative...
    adb shell "setprop ctl.restart zygote" 2>nul
    if errorlevel 1 (
        echo Cannot restart system server - trying soft reboot...
        adb reboot
        echo.
        echo Emulator is rebooting... This will take 30-60 seconds.
        echo Wait for the Android home screen to appear again.
        echo.
        timeout /t 40 /nobreak

        echo Waiting for device to come back online...
        adb wait-for-device
        timeout /t 10 /nobreak
    ) else (
        echo Zygote restarted, waiting for services...
        timeout /t 15 /nobreak
    )
) else (
    echo System server restarted, waiting for services...
    timeout /t 15 /nobreak
)

echo.
echo [5/6] Reconnecting ADB...
adb reconnect
timeout /t 3 /nobreak

echo.
echo [6/6] Testing package manager...
adb shell pm list packages -3
echo.

if errorlevel 1 (
    echo ========================================
    echo STILL FAILED - Emulator needs full restart
    echo ========================================
    echo.
    echo The emulator is corrupted. Please do this:
    echo.
    echo 1. Close this window
    echo 2. Close the emulator (X button)
    echo 3. Open Task Manager (Ctrl+Shift+Esc)
    echo 4. End these processes if they exist:
    echo    - qemu-system-x86_64.exe
    echo    - adb.exe
    echo 5. Run: launch-emulator.bat
    echo 6. Wait for FULL boot (Android home screen visible)
    echo 7. Run: start-android.bat
    echo.
) else (
    echo ========================================
    echo SUCCESS!
    echo ========================================
    echo.
    echo Package manager is working now.
    echo.
    echo Next steps:
    echo 1. Go back to your Metro terminal
    echo 2. Press 'a' to launch on Android
    echo.
)

pause
