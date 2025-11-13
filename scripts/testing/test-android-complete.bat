@echo off
REM ==============================================================================
REM test-android-complete.bat - Complete Android Testing Workflow
REM ==============================================================================
REM This script runs the full testing workflow:
REM   1. Automated emulator setup and app launch
REM   2. Interactive testing session
REM   3. Automated error analysis
REM   4. Generate comprehensive report
REM ==============================================================================

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║     Medilex - Complete Android Testing Workflow               ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo This will:
echo   1. Launch Android emulator (if needed)
echo   2. Start the app automatically
echo   3. Let you test interactively
echo   4. Analyze errors when you're done
echo   5. Generate a comprehensive report
echo.
echo Press any key to start, or Ctrl+C to cancel...
pause >nul
echo.

REM ==============================================================================
REM PHASE 1: Automated Setup and Launch
REM ==============================================================================

echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    PHASE 1: Setup & Launch                     ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

call test-android-auto.bat

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Automated setup failed!
    echo.
    echo Please check the error messages above.
    echo.
    pause
    exit /b 1
)

REM ==============================================================================
REM PHASE 2: Error Analysis
REM ==============================================================================

echo.
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                   PHASE 2: Error Analysis                      ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Analyzing errors from testing session...
echo.

REM Run Node.js error analysis
node analyze-android-errors.js

if %errorlevel% neq 0 (
    echo.
    echo [WARNING] Error analysis failed, but continuing...
    echo.
)

REM ==============================================================================
REM PHASE 3: Generate Report
REM ==============================================================================

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                   PHASE 3: Generate Report                     ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

set REPORT_FILE=android-test-report-%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%.txt
set REPORT_FILE=%REPORT_FILE: =0%

echo Generating comprehensive test report...
echo.

(
    echo ================================================================================
    echo MEDILEX - ANDROID TEST REPORT
    echo ================================================================================
    echo.
    echo Date: %date% %time%
    echo Tester: %username%
    echo.
    echo ================================================================================
    echo ENVIRONMENT
    echo ================================================================================
    echo.
    echo Android SDK: %ANDROID_HOME%
    echo.
    echo ADB Version:
    adb version 2^>^&1
    echo.
    echo Connected Devices:
    adb devices
    echo.
    echo ================================================================================
    echo TEST EXECUTION
    echo ================================================================================
    echo.
    echo Status: Completed
    echo Duration: See timestamps above
    echo.
    echo ================================================================================
    echo ERROR SUMMARY
    echo ================================================================================
    echo.
    
    if exist "android-error-report.json" (
        echo See android-error-report.json for detailed error analysis
        echo.
        type android-error-report.json
    ) else (
        echo No error report generated
    )
    
    echo.
    echo ================================================================================
    echo VERIFICATION CHECKLIST
    echo ================================================================================
    echo.
    echo Manual verification required:
    echo   [ ] App launches successfully
    echo   [ ] All 5 tabs are accessible
    echo   [ ] Swipe gestures work (left and right^)
    echo   [ ] Action buttons respond
    echo   [ ] Success toasts appear
    echo   [ ] Startup loader shows
    echo   [ ] No crashes during testing
    echo.
    echo ================================================================================
    echo NEXT STEPS
    echo ================================================================================
    echo.
    echo 1. Review this report: %REPORT_FILE%
    echo 2. Check android-error-report.json for detailed errors
    echo 3. Review VERIFICATION-CHECKLIST.md
    echo 4. Fix any issues found
    echo 5. Re-run this test to verify fixes
    echo.
    echo ================================================================================
    echo END OF REPORT
    echo ================================================================================
) > "%REPORT_FILE%"

echo ✓ Report saved: %REPORT_FILE%
echo.

REM ==============================================================================
REM PHASE 4: Summary
REM ==============================================================================

echo ╔════════════════════════════════════════════════════════════════╗
echo ║                      Testing Complete!                         ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Generated files:
echo   - %REPORT_FILE%
echo   - android-error-report.json (if errors found^)
echo   - android-test-errors.log (if errors found^)
echo.
echo Next steps:
echo   1. Review the test report above
echo   2. Check for any errors in android-error-report.json
echo   3. Verify all features in VERIFICATION-CHECKLIST.md
echo   4. Fix any issues and re-test
echo.
echo To re-run testing:
echo   test-android-complete.bat
echo.
echo To analyze errors only:
echo   node analyze-android-errors.js
echo.

pause
