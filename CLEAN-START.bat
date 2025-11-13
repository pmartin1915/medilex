@echo off
title Nuclear Clean & Restart
echo.
echo ========================================
echo   NUCLEAR CLEAN - iOS Error Fix
echo ========================================
echo.
echo This will:
echo   - Stop all Node processes
echo   - Clear Metro bundler cache
echo   - Clear Expo cache
echo   - Clear watchman cache
echo   - Restart Metro with clean cache
echo.
set /p confirm="Continue? (y/n): "
if /i not "%confirm%"=="y" exit /b

echo.
echo [1/6] Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/6] Clearing Metro bundler cache...
if exist %TEMP%\metro-* rmdir /s /q %TEMP%\metro-* 2>nul
if exist %TEMP%\react-* rmdir /s /q %TEMP%\react-* 2>nul

echo [3/6] Clearing Expo cache...
if exist .expo rmdir /s /q .expo
if exist %USERPROFILE%\.expo\metro-cache rmdir /s /q %USERPROFILE%\.expo\metro-cache 2>nul

echo [4/6] Clearing watchman cache...
watchman watch-del-all 2>nul

echo [5/6] Clearing npm cache...
npm cache clean --force 2>nul

echo [6/6] Starting Metro with clean cache...
echo.
echo ========================================
echo   Metro Starting - Scan QR with iOS
echo ========================================
echo.
npx expo start --clear

pause
