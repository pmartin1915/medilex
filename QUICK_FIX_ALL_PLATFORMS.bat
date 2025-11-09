@echo off
echo ========================================
echo Quick Fix: All Platforms
echo ========================================
echo.
echo This will fix iOS, Android, and Web caching issues.
echo.
pause

echo [1/4] Stopping all running processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/4] Clearing ALL caches...
if exist node_modules\.cache rmdir /s /q node_modules\.cache
if exist .expo rmdir /s /q .expo
if exist %TEMP%\haste-map-* rmdir /s /q %TEMP%\haste-map-*
if exist %TEMP%\metro-* rmdir /s /q %TEMP%\metro-*
if exist %TEMP%\react-native-* rmdir /s /q %TEMP%\react-native-*
npm cache clean --force 2>nul

echo [3/4] Verifying you have the latest code...
echo.
echo Current branch:
git branch --show-current
echo.
echo Latest commit should be: "Add vertical swipe navigation to Learn screen"
git log --oneline -1
echo.

echo [4/4] Checking for vertical swipe feature...
findstr /C:"handleSwipeUp" src\screens\LearnScreen.tsx >nul 2>&1
if %errorlevel%==0 (
    echo ✓ Vertical swipe feature FOUND in code!
    echo.
    echo You have the correct code. Starting Metro bundler...
    echo.
    npx expo start --clear
) else (
    echo ✗ Vertical swipe feature NOT FOUND!
    echo.
    echo You need to pull the latest code first!
    echo Run: .\GET_LATEST_CODE.bat
    echo.
    pause
    exit /b 1
)
