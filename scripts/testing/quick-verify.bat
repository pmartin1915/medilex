@echo off
REM ========================================
REM Healthcare Vocab App - Quick Verification
REM ========================================
REM
REM This script:
REM 1. Opens the verification checklist
REM 2. Starts Metro and opens the app in browser
REM 3. Allows side-by-side verification
REM
REM Purpose: Quick testing for both user and AI
REM ========================================

echo.
echo ========================================
echo   Quick Verification Helper
echo ========================================
echo.

REM Step 1: Check if verification checklist exists
if not exist "VERIFICATION-CHECKLIST.md" (
    echo ERROR: VERIFICATION-CHECKLIST.md not found!
    echo Please make sure you're in the project root directory.
    echo.
    pause
    exit /b 1
)

REM Step 2: Open verification checklist
echo [1/4] Opening verification checklist...
start "" "VERIFICATION-CHECKLIST.md"
echo       ✓ Checklist opened
echo.

REM Wait a moment for file to open
timeout /t 2 /nobreak >nul

REM Step 3: Kill existing Metro servers (only on port 8081)
echo [2/4] Cleaning up old Metro servers...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING') do (
    echo       Stopping process %%a on port 8081...
    taskkill //F //PID %%a 2>nul
)
echo       ✓ Port 8081 is available
echo.

REM Step 4: Clear Metro cache
echo [3/4] Clearing Metro cache for clean test...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache 2>nul
    echo       ✓ Cache cleared
) else (
    echo       • Cache already clean
)
echo.

REM Step 5: Start Metro and open browser
echo [4/4] Starting Metro and opening browser...
echo       This will take 30-60 seconds...
echo.
start /B npx expo start --web > quick-verify-output.txt 2>&1

REM Progress indicator
echo       Progress:
echo       [          ] 0%%  - Starting Metro...
timeout /t 10 /nobreak >nul
echo       [===       ] 30%% - Bundling...
timeout /t 10 /nobreak >nul
echo       [======    ] 60%% - Optimizing...
timeout /t 10 /nobreak >nul
echo       [==========] 100%% - Ready!
echo.

REM Open browser
start http://localhost:8081
echo       ✓ Browser opened to http://localhost:8081
echo.

REM Display instructions
echo ========================================
echo   NOW: Verify the App!
echo ========================================
echo.
echo You should now have TWO windows open:
echo   1. Verification checklist (text editor)
echo   2. App in browser (http://localhost:8081)
echo.
echo Go through the checklist and mark each item:
echo   ✓ = Working correctly
echo   ✗ = Issue found (note details)
echo.
echo ========================================
echo   Quick Verification Items:
echo ========================================
echo.
echo [ ] Bottom tabs visible (5 tabs)
echo [ ] Learn tab loads
echo [ ] Centered white card
echo [ ] 4 action buttons at BOTTOM of card
echo [ ] Icons render (SVG, not Unicode)
echo [ ] Buttons clickable
echo [ ] Swipe left/right works
echo [ ] Content scrollable
echo.
echo For detailed checklist, see the opened file.
echo.
echo ========================================
echo   When finished:
echo ========================================
echo.
echo Press any key to STOP Metro and exit...
echo.
pause >nul

REM Cleanup
echo.
echo Stopping Metro server...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING') do (
    echo       Stopping process %%a...
    taskkill //F //PID %%a 2>nul
)
echo ✓ Metro stopped
echo.

REM Summary
echo ========================================
echo   Verification Complete!
echo ========================================
echo.
echo If you found any issues, check:
echo   • quick-verify-output.txt (Metro logs)
echo   • Browser console (F12)
echo   • HANDOFF.md (current state)
echo.
echo To run verification again:
echo   .\quick-verify.bat
echo.
echo To sync with git before testing:
echo   .\sync-with-git.bat
echo   .\quick-verify.bat
echo.
echo Goodbye!
timeout /t 2 /nobreak >nul
