@echo off
echo ========================================
echo Healthcare Vocab App - Quick Fix
echo ========================================
echo.
echo This will clear all caches and restart
echo.
pause

echo.
echo [1/3] Stopping any running Metro bundler...
taskkill /F /IM node.exe 2>nul

echo.
echo [2/3] Clearing Expo cache...
npx expo start --clear --no-dev --minify

echo.
echo Done! Check the console for initialization logs.
echo Look for: [INIT] messages
echo.
pause
