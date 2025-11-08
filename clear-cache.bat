@echo off
echo ========================================
echo Healthcare Vocab App - Clear Cache
echo ========================================
echo.
echo This will clear all caches and temporary files.
echo.

echo [1/5] Stopping Metro bundler...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/5] Clearing npm cache...
npm cache clean --force

echo [3/5] Removing node_modules...
if exist node_modules (
    rmdir /s /q node_modules
)

echo [4/5] Removing .expo cache...
if exist .expo (
    rmdir /s /q .expo
)

echo [5/5] Clearing watchman cache...
watchman watch-del-all 2>nul

echo.
echo ========================================
echo Cache cleared successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Run: npm install
echo 2. Run: start-android.bat
echo.
pause
