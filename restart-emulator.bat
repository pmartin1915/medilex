@echo off
echo ========================================
echo Restart Emulator - Full Clean Restart
echo ========================================
echo.

set ANDROID_HOME=D:\Android\Sdk
set PATH=%PATH%;D:\Android\Sdk\platform-tools;D:\Android\Sdk\emulator

echo This will completely restart your Android emulator.
echo Any unsaved work in the emulator will be lost.
echo Your Metro bundler will stay running.
echo.
echo Press Ctrl+C to cancel, or
pause

echo.
echo [1/4] Killing ADB server...
adb kill-server
timeout /t 1 /nobreak >nul

echo [2/4] Closing emulator...
adb -s emulator-5554 emu kill 2>nul

echo Giving processes time to close...
timeout /t 3 /nobreak >nul

echo Ensuring all emulator processes are dead...
taskkill /F /IM qemu-system-x86_64.exe >nul 2>&1
taskkill /F /IM adb.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo.
echo [3/4] Starting fresh emulator...
echo This will open in a new window.
echo.
start emulator -avd Medium_Phone_API_36.1 -no-snapshot-load

echo.
echo [4/4] Waiting for emulator to boot...
echo This takes 30-60 seconds. Watch for the Android home screen.
echo.

timeout /t 15 /nobreak

echo Starting ADB server...
adb start-server >nul 2>&1
timeout /t 3 /nobreak

echo Waiting for device...
adb wait-for-device
echo Device connected!

timeout /t 5 /nobreak

echo.
echo Checking boot status...
:wait_boot
adb shell getprop sys.boot_completed 2>nul | findstr "1" >nul
if errorlevel 1 (
    echo Still booting... (this is normal, be patient)
    timeout /t 5 /nobreak
    goto wait_boot
)

echo.
echo ========================================
echo Emulator fully booted!
echo ========================================
echo.

echo Final check - testing package manager...
adb shell pm list packages -3 >nul 2>&1
if errorlevel 1 (
    echo WARNING: Package manager still warming up...
    echo Waiting 5 more seconds...
    timeout /t 5 /nobreak
    adb shell pm list packages -3 >nul 2>&1
    if errorlevel 1 (
        echo Package manager still not ready. Give it more time.
    ) else (
        echo Package manager OK!
    )
) else (
    echo Package manager OK!
)

echo.
echo ========================================
echo READY TO USE
echo ========================================
echo.
echo Your emulator is fully booted and ready.
echo.
echo Next steps:
echo 1. Go to your Metro bundler terminal
echo 2. Press 'a' to launch on Android
echo 3. Your app should load without errors!
echo.
pause
