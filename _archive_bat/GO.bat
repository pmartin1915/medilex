@echo off
echo.
echo ========================================
echo   STARTING APP (Fresh + Clean)
echo ========================================
echo.

REM Kill any existing Metro/Node processes
echo [1/4] Killing old processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak >nul

REM Clear all caches
echo [2/4] Clearing caches...
rmdir /s /q .expo 2>nul
rmdir /s /q node_modules\.cache 2>nul

REM Start Metro with clear cache
echo [3/4] Starting Metro bundler...
start "Metro Bundler" cmd /k "npx expo start --clear"

REM Wait for Metro to be ready
echo [4/4] Waiting for Metro to start...
timeout /t 8 /nobreak >nul

REM Open in browser
echo.
echo Opening in browser...
start http://localhost:8081

echo.
echo ========================================
echo   READY! Press 'w' in Metro window
echo   Or scan QR code with Expo Go
echo ========================================
echo.
pause
