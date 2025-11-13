@echo off
setlocal enabledelayedexpansion

REM Set Android SDK paths
set ANDROID_HOME=D:\Android\Sdk
set PATH=%PATH%;D:\Android\Sdk\platform-tools;D:\Android\Sdk\emulator

:menu
cls
echo ========================================
echo Android Emulator Troubleshooter
echo ========================================
echo.
echo What issue are you experiencing?
echo.
echo 1. "Can't find service: package" error
echo 2. Emulator not responding / frozen
echo 3. App shows white/black screen
echo 4. Metro bundler won't start
echo 5. Start from scratch (full reset)
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto fix_package
if "%choice%"=="2" goto fix_frozen
if "%choice%"=="3" goto fix_screen
if "%choice%"=="4" goto fix_metro
if "%choice%"=="5" goto full_reset
if "%choice%"=="6" goto end
goto menu

:fix_package
cls
echo ========================================
echo Fixing "Can't find service: package"
echo ========================================
echo.
echo This will try multiple fixes in order.
echo.
pause

echo.
echo [Attempt 1/3] Quick ADB reset...
call fix-adb-quick.bat
adb shell pm list packages -3 >nul 2>&1
if not errorlevel 1 (
    echo.
    echo SUCCESS! Go back to Metro and press 'a'
    pause
    goto menu
)

echo.
echo [Attempt 2/3] Restarting Android system services...
call fix-emulator-nuclear.bat
adb shell pm list packages -3 >nul 2>&1
if not errorlevel 1 (
    echo.
    echo SUCCESS! Go back to Metro and press 'a'
    pause
    goto menu
)

echo.
echo [Attempt 3/3] Full emulator restart...
call restart-emulator.bat
echo.
echo If you see "READY TO USE" above, go press 'a' in Metro!
pause
goto menu

:fix_frozen
cls
echo ========================================
echo Fixing Frozen Emulator
echo ========================================
echo.
echo This will completely restart your emulator.
echo Metro bundler will stay running.
echo.
pause

call restart-emulator.bat
echo.
echo Emulator has been restarted.
echo Go back to Metro and press 'a'
pause
goto menu

:fix_screen
cls
echo ========================================
echo Fixing White/Black Screen
echo ========================================
echo.
echo This was likely the TurboModuleRegistry error (now fixed).
echo.
echo Solutions:
echo 1. Clear cache and restart Metro
echo 2. Restart emulator
echo.
set /p screenchoice="Choose (1 or 2): "

if "%screenchoice%"=="1" goto clear_cache
if "%screenchoice%"=="2" (
    call restart-emulator.bat
    goto menu
)
goto fix_screen

:clear_cache
cls
echo Clearing all caches...
call clear-cache.bat
echo.
echo Cache cleared. Now starting app...
call start-android.bat
goto menu

:fix_metro
cls
echo ========================================
echo Fixing Metro Bundler
echo ========================================
echo.
echo This will:
echo 1. Kill any running Metro processes
echo 2. Clear all caches
echo 3. Start fresh Metro bundler
echo.
pause

echo Killing existing Metro processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo Clearing caches...
rd /s /q node_modules\.cache 2>nul
rd /s /q .expo 2>nul

echo.
echo Starting fresh Metro...
echo.
npx expo start --clear
goto end

:full_reset
cls
echo ========================================
echo FULL RESET - Everything Fresh
echo ========================================
echo.
echo This will:
echo 1. Kill all emulator and Metro processes
echo 2. Clear all caches
echo 3. Restart ADB
echo 4. Launch fresh emulator
echo 5. Start Metro bundler
echo.
echo This takes about 90 seconds.
echo.
pause

echo [1/5] Killing all processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM qemu-system-x86_64.exe >nul 2>&1
adb kill-server >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/5] Clearing caches...
rd /s /q node_modules\.cache 2>nul
rd /s /q .expo 2>nul
rd /s /q %TEMP%\haste-map-* 2>nul
rd /s /q %TEMP%\metro-* 2>nul

echo [3/5] Restarting ADB...
adb start-server >nul 2>&1
timeout /t 3 /nobreak >nul

echo [4/5] Launching emulator...
start emulator -avd Medium_Phone_API_36.1 -no-snapshot-load
timeout /t 15 /nobreak
adb wait-for-device
echo Waiting for full boot...
:wait_full_reset
adb shell getprop sys.boot_completed 2>nul | findstr "1" >nul
if errorlevel 1 (
    timeout /t 5 /nobreak >nul
    goto wait_full_reset
)

echo [5/5] Starting Metro...
echo.
npx expo start --clear
goto end

:end
endlocal
exit /b
