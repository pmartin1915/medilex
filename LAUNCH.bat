@echo off
title Healthcare Vocab App Launcher
echo.
echo ========================================
echo   Healthcare Vocabulary App Launcher
echo ========================================
echo.
echo Choose your platform:
echo.
echo 1. Web (browser)
echo 2. iOS Simulator  
echo 3. Android Emulator
echo 4. Test iOS Fix
echo 5. Git Helper
echo 6. Clear Cache and Restart
echo.
set /p choice="Enter choice (1-6): "

if "%choice%"=="1" (
    echo Starting web version...
    npx expo start --web
)

if "%choice%"=="2" (
    echo Starting iOS simulator...
    npx expo start --ios
)

if "%choice%"=="3" (
    echo Starting Android emulator...
    npx expo start --android
)

if "%choice%"=="4" (
    echo Running iOS fix test...
    call test-ios-fix.bat
)

if "%choice%"=="5" (
    echo Opening git helper...
    call git-helper.bat
)

if "%choice%"=="6" (
    echo Clearing cache...
    npx expo start --clear
)

echo.
echo Done!
pause