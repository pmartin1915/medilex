@echo off
title Healthcare Vocab App Launcher
echo.
echo ========================================
echo   Healthcare Vocabulary App Launcher
echo ========================================
echo.
echo Choose your option:
echo.
echo 1. Start Metro (scan QR with phone)
echo 2. Start Web version
echo 3. Nuclear Clean + Restart (iOS fix)
echo 4. Git Helper
echo 5. Run Tests
echo 6. Exit
echo.
set /p choice="Enter choice (1-6): "

if "%choice%"=="1" (
    echo.
    echo Starting Metro bundler...
    echo Scan the QR code with Expo Go on your phone
    echo.
    npx expo start
)

if "%choice%"=="2" (
    echo.
    echo Starting web version...
    echo.
    npx expo start --web
)

if "%choice%"=="3" (
    echo.
    call CLEAN-START.bat
)

if "%choice%"=="4" (
    echo.
    call GIT-HELPER.bat
)

if "%choice%"=="5" (
    echo.
    echo Running tests...
    echo.
    npm test
)

if "%choice%"=="6" (
    exit /b
)

echo.
echo Done!
pause