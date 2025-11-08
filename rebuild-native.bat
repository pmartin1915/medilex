@echo off
echo ========================================
echo Rebuilding Native Binaries
echo ========================================
echo.
echo This will fix the TurboModuleRegistry error
echo by regenerating iOS and Android native folders.
echo.

echo [1/6] Stopping Metro bundler...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/6] Removing old native folders...
if exist ios (
    echo Removing ios folder...
    rmdir /s /q ios
)
if exist android (
    echo Removing android folder...
    rmdir /s /q android
)

echo [3/6] Clearing all caches...
if exist node_modules (
    rmdir /s /q node_modules
)
if exist .expo (
    rmdir /s /q .expo
)
npm cache clean --force 2>nul
watchman watch-del-all 2>nul

echo [4/6] Reinstalling dependencies...
call npm install

echo [5/6] Running prebuild to generate native folders...
echo This will take a few minutes...
call npx expo prebuild --clean

echo [6/6] Complete!
echo.
echo ========================================
echo Native folders regenerated!
echo ========================================
echo.
echo Next steps:
echo 1. Start Metro: npx expo start --clear
echo 2. Press 'a' for Android or 'i' for iOS
echo.
echo The TurboModuleRegistry error should be fixed!
echo.
pause
