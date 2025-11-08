@echo off
echo ========================================
echo Healthcare Vocab App - Android Startup
echo ========================================
echo.

set ANDROID_HOME=D:\Android\Sdk
set PATH=%PATH%;D:\Android\Sdk\platform-tools;D:\Android\Sdk\emulator

echo [1/5] Resetting ADB connection (preventing "Can't find service" error)...
adb kill-server >nul 2>&1
timeout /t 1 /nobreak >nul
adb start-server >nul 2>&1
timeout /t 2 /nobreak >nul
echo ADB server reset complete.
echo.

echo [2/5] Checking connected devices...
adb devices
echo.

echo [3/5] Waiting for emulator to be fully ready...
timeout /t 3 /nobreak >nul

adb shell getprop sys.boot_completed 2>nul | findstr "1" >nul
if errorlevel 1 (
    echo.
    echo WARNING: Emulator not fully booted yet!
    echo Giving it more time...
    timeout /t 5 /nobreak

    adb shell getprop sys.boot_completed 2>nul | findstr "1" >nul
    if errorlevel 1 (
        echo.
        echo ERROR: Emulator still not ready!
        echo Please wait for emulator to finish loading completely.
        echo Look for the home screen in the emulator window.
        echo.
        pause
        exit /b 1
    )
)
echo Emulator is ready!
echo.

echo [4/5] Testing package manager service...
adb shell pm list packages -3 >nul 2>&1
if errorlevel 1 (
    echo Package manager not responding, forcing ADB reconnect...
    adb reconnect >nul 2>&1
    timeout /t 2 /nobreak >nul
    adb shell pm list packages -3 >nul 2>&1
    if errorlevel 1 (
        echo WARNING: Package manager still not responding.
        echo This might cause issues. Continuing anyway...
    ) else (
        echo Package manager OK after reconnect.
    )
) else (
    echo Package manager service OK.
)
echo.

echo [5/5] Starting Expo Metro bundler...
echo.
echo TIP: If you still get "Can't find service: package" error:
echo   1. Close the emulator completely
echo   2. Restart it and wait for full boot
echo   3. Run this script again
echo.
npx expo start
