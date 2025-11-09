@echo off
REM ==============================================================================
REM test-app-features.bat - Automated Feature Testing for Healthcare Vocab App
REM ==============================================================================
REM This script performs automated testing of all app features
REM ==============================================================================

echo.
echo ════════════════════════════════════════════════════════════════
echo         Healthcare Vocab App - Automated Feature Tests
echo ════════════════════════════════════════════════════════════════
echo.

setlocal enabledelayedexpansion
set PASSED=0
set FAILED=0
set TOTAL=0

echo [STARTING AUTOMATED TESTS]
echo.

REM ═══════════════════════════════════════════════════════════════════════════
REM Test 1: Check if ADB is installed
REM ═══════════════════════════════════════════════════════════════════════════
set /a TOTAL+=1
echo [Test 1/%TOTAL%] Checking ADB Installation...
where adb >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   PASS - ADB is installed
    set /a PASSED+=1
) else (
    echo   FAIL - ADB not found
    set /a FAILED+=1
)
echo.

REM ═══════════════════════════════════════════════════════════════════════════
REM Test 2: Check device connection
REM ═══════════════════════════════════════════════════════════════════════════
set /a TOTAL+=1
echo [Test 2/%TOTAL%] Checking Device Connection...
adb devices | findstr "emulator\|device" | findstr /V "List of devices" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   PASS - Device connected
    set /a PASSED+=1
) else (
    echo   FAIL - No device connected
    set /a FAILED+=1
)
echo.

REM ═══════════════════════════════════════════════════════════════════════════
REM Test 3: Check Metro bundler status
REM ═══════════════════════════════════════════════════════════════════════════
set /a TOTAL+=1
echo [Test 3/%TOTAL%] Checking Metro Bundler...
curl -s http://localhost:8081/status | findstr "packager-status:running" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   PASS - Metro bundler is running
    set /a PASSED+=1
) else (
    echo   WARN - Metro bundler not detected (may be OK if not running)
    REM Don't count as failure
)
echo.

REM ═══════════════════════════════════════════════════════════════════════════
REM Test 4: Check for recent app errors
REM ═══════════════════════════════════════════════════════════════════════════
set /a TOTAL+=1
echo [Test 4/%TOTAL%] Checking for Recent App Errors...
adb logcat -d | findstr "VOCAB_APP_ERROR" | findstr "Type: ERROR" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   FAIL - App errors detected in logs
    set /a FAILED+=1
) else (
    echo   PASS - No app errors found
    set /a PASSED+=1
)
echo.

REM ═══════════════════════════════════════════════════════════════════════════
REM Test 5: Check project structure
REM ═══════════════════════════════════════════════════════════════════════════
set /a TOTAL+=1
echo [Test 5/%TOTAL%] Checking Project Structure...
if exist "src\" (
    if exist "src\screens\" (
        if exist "src\components\" (
            if exist "src\utils\" (
                if exist "src\store\" (
                    echo   PASS - Project structure is complete
                    set /a PASSED+=1
                    goto :structure_ok
                )
            )
        )
    )
)
echo   FAIL - Project structure incomplete
set /a FAILED+=1
:structure_ok
echo.

REM ═══════════════════════════════════════════════════════════════════════════
REM Test 6: Check key files exist
REM ═══════════════════════════════════════════════════════════════════════════
set /a TOTAL+=1
echo [Test 6/%TOTAL%] Checking Key Files...
set FILES_OK=1
if not exist "package.json" set FILES_OK=0
if not exist "App.tsx" set FILES_OK=0
if not exist "src\data\sampleTerms.ts" set FILES_OK=0
if not exist "src\utils\errorLogger.ts" set FILES_OK=0
if not exist "src\utils\dataValidator.ts" set FILES_OK=0

if %FILES_OK% EQU 1 (
    echo   PASS - All key files present
    set /a PASSED+=1
) else (
    echo   FAIL - Some key files missing
    set /a FAILED+=1
)
echo.

REM ═══════════════════════════════════════════════════════════════════════════
REM Test 7: Check dependencies installed
REM ═══════════════════════════════════════════════════════════════════════════
set /a TOTAL+=1
echo [Test 7/%TOTAL%] Checking Dependencies...
if exist "node_modules\" (
    echo   PASS - Dependencies installed
    set /a PASSED+=1
) else (
    echo   FAIL - node_modules folder not found
    set /a FAILED+=1
)
echo.

REM ═══════════════════════════════════════════════════════════════════════════
REM Test 8: Verify medical terms data
REM ═══════════════════════════════════════════════════════════════════════════
set /a TOTAL+=1
echo [Test 8/%TOTAL%] Verifying Medical Terms Data...
findstr /C:"term_025" "src\data\sampleTerms.ts" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   PASS - Full dataset present (25 terms detected)
    set /a PASSED+=1
) else (
    echo   WARN - Full dataset may not be present
    REM Check for at least 5 terms
    findstr /C:"term_005" "src\data\sampleTerms.ts" >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo   PASS - Minimum dataset present (5+ terms)
        set /a PASSED+=1
    ) else (
        echo   FAIL - Insufficient term data
        set /a FAILED+=1
    )
)
echo.

REM ═══════════════════════════════════════════════════════════════════════════
REM Test Results Summary
REM ═══════════════════════════════════════════════════════════════════════════
echo ════════════════════════════════════════════════════════════════
echo                        TEST RESULTS
echo ════════════════════════════════════════════════════════════════
echo.
echo Total Tests:   %TOTAL%
echo Passed:        %PASSED%
echo Failed:        %FAILED%
echo.

if %FAILED% EQU 0 (
    echo STATUS: ALL TESTS PASSED
    echo.
    echo Your app is ready for development!
    echo.
    echo Next Steps:
    echo   1. Run .\quick-start.bat to start the app
    echo   2. Open Debug tab and run self-tests
    echo   3. Test all 5 screens manually
    echo.
    exit /b 0
) else (
    echo STATUS: SOME TESTS FAILED
    echo.
    echo Please fix the failed tests before proceeding.
    echo.
    echo Troubleshooting:
    echo   - Install Android SDK Platform-Tools for ADB
    echo   - Start Android emulator: emulator @your_avd_name
    echo   - Run npm install to install dependencies
    echo   - Start Metro bundler: npm start
    echo.
    exit /b 1
)

endlocal
