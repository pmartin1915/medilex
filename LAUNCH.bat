@echo off
setlocal enabledelayedexpansion

:MENU
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo          Healthcare Vocab App - Master Launcher
echo ════════════════════════════════════════════════════════════════
echo.
echo  START APP:
echo   [1] Start App (Web)
echo   [2] Start App (iOS - QR Code)
echo   [3] Start App (Android Emulator)
echo.
echo  DIAGNOSTICS:
echo   [4] Show Current Errors
echo   [5] Copy Error Report for AI
echo   [6] Monitor Live Logs
echo.
echo  FIXES:
echo   [7] Clear Cache and Restart
echo   [8] Fix Android Connection
echo   [9] Full Reset (Nuclear Option)
echo.
echo   [0] Exit
echo.
echo ════════════════════════════════════════════════════════════════
set /p choice="Choose option (0-9): "

if "%choice%"=="1" goto START_WEB
if "%choice%"=="2" goto START_IOS
if "%choice%"=="3" goto START_ANDROID
if "%choice%"=="4" goto SHOW_ERRORS
if "%choice%"=="5" goto COPY_ERRORS
if "%choice%"=="6" goto MONITOR
if "%choice%"=="7" goto CLEAR_CACHE
if "%choice%"=="8" goto FIX_ANDROID
if "%choice%"=="9" goto FULL_RESET
if "%choice%"=="0" goto EXIT
goto MENU

:START_WEB
cls
echo Starting app on WEB...
echo.
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak >nul
start "Metro" cmd /k "cd /d %~dp0 && npx expo start --clear"
timeout /t 8 /nobreak >nul
start http://localhost:8081
echo.
echo App started! Press 'w' in Metro window if browser doesn't open.
echo.
pause
goto MENU

:START_IOS
cls
echo Starting app for iOS...
echo.
echo 1. Make sure Expo Go is installed on your iPhone
echo 2. Ensure iPhone and PC are on same WiFi
echo 3. Scan the QR code that appears
echo 4. Press Ctrl+C in Metro window when done
echo.
pause
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak >nul
start "Metro" cmd /k "cd /d %~dp0 && npx expo start --clear"
echo.
echo Metro started! Scan QR code with Expo Go app.
echo Close Metro window when done, then press any key...
echo.
pause
goto MENU

:START_ANDROID
cls
echo Starting app on Android...
echo.
set ANDROID_HOME=D:\Android\Sdk
set PATH=%PATH%;D:\Android\Sdk\platform-tools;D:\Android\Sdk\emulator

adb devices | findstr "emulator" >nul 2>&1
if errorlevel 1 (
    echo No emulator detected. Launching...
    start emulator -avd Medium_Phone_API_36.1
    echo Waiting for emulator to boot...
    timeout /t 15 /nobreak >nul
    adb wait-for-device
    :wait_boot
    adb shell getprop sys.boot_completed 2>nul | findstr "1" >nul
    if errorlevel 1 (
        timeout /t 3 /nobreak >nul
        goto wait_boot
    )
    echo Emulator ready!
)

taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak >nul
echo.
echo Starting Metro... Press 'a' when QR code appears.
echo.
start "Metro" cmd /k "cd /d %~dp0 && npx expo start --clear"
echo.
echo Metro started! Press 'a' in Metro window to launch on Android.
echo Close Metro window when done, then press any key...
echo.
pause
goto MENU

:SHOW_ERRORS
cls
echo ════════════════════════════════════════════════════════════════
echo                    Current Error Report
echo ════════════════════════════════════════════════════════════════
echo.

set ANDROID_HOME=D:\Android\Sdk
set PATH=%PATH%;D:\Android\Sdk\platform-tools
adb devices | findstr "emulator device" >nul 2>&1
if errorlevel 1 (
    echo No Android device connected
    echo Start emulator first to see Android errors
    echo.
) else (
    echo [Android Logcat - Last 50 errors]
    echo ════════════════════════════════════════════════════════════════
    adb logcat -d -v time | findstr /I "VOCAB_APP_ERROR ERROR Exception FATAL ReactNativeJS" | more +1
    echo.
)

echo ════════════════════════════════════════════════════════════════
echo.
echo TIP: Use option [5] to copy full error report for AI assistance
echo.
pause
goto MENU

:COPY_ERRORS
cls
echo ════════════════════════════════════════════════════════════════
echo              Generating AI Error Report...
echo ════════════════════════════════════════════════════════════════
echo.

set REPORT_FILE=%TEMP%\vocab_app_error_report.txt
echo Healthcare Vocab App - Error Report > "%REPORT_FILE%"
echo Generated: %date% %time% >> "%REPORT_FILE%"
echo ════════════════════════════════════════════════════════════════ >> "%REPORT_FILE%"
echo. >> "%REPORT_FILE%"

echo [SYSTEM INFO] >> "%REPORT_FILE%"
echo Project: D:\Medilex\HealthcareVocabApp >> "%REPORT_FILE%"
echo React: 18.2.0 >> "%REPORT_FILE%"
echo React Native: 0.81.5 >> "%REPORT_FILE%"
echo. >> "%REPORT_FILE%"

echo [METRO BUNDLER] >> "%REPORT_FILE%"
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if errorlevel 1 (
    echo Status: NOT RUNNING >> "%REPORT_FILE%"
) else (
    echo Status: RUNNING >> "%REPORT_FILE%"
)
echo. >> "%REPORT_FILE%"

set ANDROID_HOME=D:\Android\Sdk
set PATH=%PATH%;D:\Android\Sdk\platform-tools
adb devices | findstr "emulator device" >nul 2>&1
if errorlevel 1 (
    echo [ANDROID DEVICE] >> "%REPORT_FILE%"
    echo Status: NOT CONNECTED >> "%REPORT_FILE%"
    echo. >> "%REPORT_FILE%"
) else (
    echo [ANDROID DEVICE] >> "%REPORT_FILE%"
    echo Status: CONNECTED >> "%REPORT_FILE%"
    adb devices >> "%REPORT_FILE%"
    echo. >> "%REPORT_FILE%"
    
    echo [RECENT ERRORS - Last 100 lines] >> "%REPORT_FILE%"
    echo ════════════════════════════════════════════════════════════════ >> "%REPORT_FILE%"
    adb logcat -d -v time | findstr /I "VOCAB_APP_ERROR ERROR Exception FATAL ReactNativeJS" >> "%REPORT_FILE%" 2>&1
    echo. >> "%REPORT_FILE%"
)

echo [PACKAGE.JSON DEPENDENCIES] >> "%REPORT_FILE%"
echo ════════════════════════════════════════════════════════════════ >> "%REPORT_FILE%"
type package.json | findstr /C:"\"react\"" /C:"\"react-native\"" /C:"\"expo\"" >> "%REPORT_FILE%"
echo. >> "%REPORT_FILE%"

echo ════════════════════════════════════════════════════════════════ >> "%REPORT_FILE%"
echo END OF REPORT >> "%REPORT_FILE%"

type "%REPORT_FILE%" | clip

echo Error report copied to clipboard!
echo.
echo Report also saved to: %REPORT_FILE%
echo.
echo ════════════════════════════════════════════════════════════════
echo PASTE THIS TO YOUR AI ASSISTANT:
echo ════════════════════════════════════════════════════════════════
echo.
type "%REPORT_FILE%"
echo.
echo ════════════════════════════════════════════════════════════════
echo.
pause
goto MENU

:MONITOR
cls
echo ════════════════════════════════════════════════════════════════
echo                  Live Error Monitor
echo ════════════════════════════════════════════════════════════════
echo.
echo Monitoring Android logcat for errors...
echo Press Ctrl+C to stop, then close window to return to menu
echo.
echo ════════════════════════════════════════════════════════════════
echo.

set ANDROID_HOME=D:\Android\Sdk
set PATH=%PATH%;D:\Android\Sdk\platform-tools

adb devices | findstr "emulator device" >nul 2>&1
if errorlevel 1 (
    echo No Android device connected
    echo Start emulator first
    pause
    goto MENU
)

adb logcat -c
start "Monitor" cmd /k "adb logcat -v time | findstr /I VOCAB_APP_ERROR ERROR Exception FATAL ReactNativeJS"
echo.
echo Monitor started in new window.
echo Close monitor window when done, then press any key...
echo.
pause
goto MENU

:CLEAR_CACHE
cls
echo Clearing all caches...
echo.
echo [1/4] Stopping Metro...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/4] Clearing Expo cache...
if exist .expo rmdir /s /q .expo

echo [3/4] Clearing Metro cache...
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo [4/4] Clearing temp files...
del /q %TEMP%\metro-* 2>nul
del /q %TEMP%\haste-map-* 2>nul

echo.
echo Cache cleared! Starting fresh...
echo.
timeout /t 2 /nobreak >nul
start "Metro" cmd /k "cd /d %~dp0 && npx expo start --clear"
timeout /t 5 /nobreak >nul
echo.
echo Metro restarted with clean cache
echo.
pause
goto MENU

:FIX_ANDROID
cls
echo Fixing Android connection...
echo.
set ANDROID_HOME=D:\Android\Sdk
set PATH=%PATH%;D:\Android\Sdk\platform-tools

echo [1/3] Restarting ADB...
adb kill-server
timeout /t 2 /nobreak >nul
adb start-server
timeout /t 3 /nobreak >nul

echo [2/3] Checking devices...
adb devices

echo [3/3] Testing connection...
adb shell getprop sys.boot_completed
echo.

adb devices | findstr "emulator device" >nul 2>&1
if errorlevel 1 (
    echo Still no device. Try:
    echo   1. Close emulator completely
    echo   2. Restart emulator from Android Studio
    echo   3. Run this fix again
) else (
    echo Android connection fixed!
)
echo.
pause
goto MENU

:FULL_RESET
cls
echo ════════════════════════════════════════════════════════════════
echo                    FULL RESET WARNING
echo ════════════════════════════════════════════════════════════════
echo.
echo This will:
echo   - Kill all Metro and emulator processes
echo   - Clear ALL caches
echo   - Restart ADB
echo   - Launch fresh emulator
echo   - Start clean Metro bundler
echo.
echo This takes about 90 seconds.
echo.
set /p confirm="Continue? (y/n): "
if /i not "%confirm%"=="y" goto MENU

echo.
echo [1/6] Killing all processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM qemu-system-x86_64.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/6] Clearing all caches...
if exist .expo rmdir /s /q .expo
if exist node_modules\.cache rmdir /s /q node_modules\.cache
del /q %TEMP%\metro-* 2>nul
del /q %TEMP%\haste-map-* 2>nul

echo [3/6] Restarting ADB...
set ANDROID_HOME=D:\Android\Sdk
set PATH=%PATH%;D:\Android\Sdk\platform-tools;D:\Android\Sdk\emulator
adb kill-server >nul 2>&1
timeout /t 2 /nobreak >nul
adb start-server >nul 2>&1
timeout /t 3 /nobreak >nul

echo [4/6] Launching emulator...
start emulator -avd Medium_Phone_API_36.1 -no-snapshot-load
timeout /t 15 /nobreak >nul
adb wait-for-device

echo [5/6] Waiting for full boot...
:wait_reset
adb shell getprop sys.boot_completed 2>nul | findstr "1" >nul
if errorlevel 1 (
    timeout /t 3 /nobreak >nul
    goto wait_reset
)

echo [6/6] Starting Metro...
echo.
echo Full reset complete!
echo.
timeout /t 2 /nobreak >nul
start "Metro" cmd /k "cd /d %~dp0 && npx expo start --clear"
echo.
echo Metro started! Close Metro window when done.
echo.
pause
goto MENU

:EXIT
cls
echo.
echo Thanks for using Healthcare Vocab App!
echo.
timeout /t 2 /nobreak >nul
endlocal
exit /b
