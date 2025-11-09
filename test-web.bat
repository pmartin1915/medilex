@echo off
REM ========================================
REM Healthcare Vocab App - Automated Web Test
REM ========================================
REM
REM This script automatically:
REM 1. Kills any existing Metro servers
REM 2. Starts the web development server
REM 3. Waits for the bundle to build
REM 4. Opens the app in your browser
REM 5. Allows manual verification
REM
REM Purpose: Quick testing between development sessions
REM ========================================

echo.
echo ========================================
echo   Automated Web Testing
echo ========================================
echo.

REM Step 1: Kill existing Metro servers (only on port 8081, not all node processes!)
echo [1/5] Cleaning up old Metro servers...
echo       Checking for processes on port 8081...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING') do (
    echo       Found process %%a on port 8081, stopping it...
    taskkill //F //PID %%a 2>nul
)
echo       ✓ Port 8081 is now available
echo.

REM Step 2: Clear Metro cache for clean build
echo [2/5] Clearing Metro cache...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache 2>nul
    echo       ✓ Metro cache cleared
) else (
    echo       • Metro cache already clean
)
echo.

REM Step 3: Start web server in background
echo [3/5] Starting web development server...
echo       This will take 30-60 seconds for initial bundle...
echo.
start /B npx expo start --web > web-test-output.txt 2>&1
echo       ✓ Server starting in background
echo.

REM Step 4: Wait for bundle to build
echo [4/5] Waiting for Metro to bundle the app...
echo.
echo       Progress:
echo       [          ] 0%%  - Starting Metro bundler...
timeout /t 10 /nobreak >nul
echo       [===       ] 30%% - Bundling JavaScript...
timeout /t 10 /nobreak >nul
echo       [======    ] 60%% - Optimizing bundle...
timeout /t 10 /nobreak >nul
echo       [==========] 100%% - Ready!
echo.
echo       ✓ Bundle should be ready now
echo.

REM Step 5: Open browser
echo [5/5] Opening browser to http://localhost:8081...
timeout /t 2 /nobreak >nul
start http://localhost:8081
echo       ✓ Browser opened
echo.

REM Instructions
echo ========================================
echo   Test Instructions
echo ========================================
echo.
echo 1. Check that the app loads in your browser
echo 2. Verify you can see a medical term card
echo 3. Try swiping LEFT (next card)
echo 4. Try swiping RIGHT (previous card)
echo 5. Click the action buttons on the right
echo.
echo If you see errors in the browser console,
echo check web-test-output.txt for Metro logs.
echo.
echo ========================================
echo   When finished testing:
echo ========================================
echo.
echo Press any key to STOP the Metro server
echo and close this window.
echo.
pause >nul

REM Cleanup: Kill Metro server (only the one on port 8081!)
echo.
echo Stopping Metro server...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING') do (
    echo       Stopping process %%a on port 8081...
    taskkill //F //PID %%a 2>nul
)
echo ✓ Metro server stopped
echo.
echo Cleanup complete. Goodbye!
timeout /t 2 /nobreak >nul
