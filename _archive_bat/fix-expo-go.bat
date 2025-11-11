@echo off
echo ========================================
echo Fix for Expo Go - Module Registry Error
echo ========================================
echo.

echo [1/5] Stopping all Metro processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/5] Clearing Expo cache...
if exist .expo (
    rmdir /s /q .expo
)

echo [3/5] Clearing Metro bundler cache...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
)

echo [4/5] Clearing watchman cache...
watchman watch-del-all 2>nul

echo [5/5] Starting fresh Metro bundler...
echo.
echo ========================================
echo Cache cleared!
echo ========================================
echo.
echo Now starting Metro with cleared cache...
echo.
npx expo start --clear
