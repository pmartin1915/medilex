@echo off
echo ========================================
echo Healthcare Vocab App - DEBUG MODE
echo ========================================
echo.
echo This mode provides enhanced debugging features:
echo   - Verbose Metro bundler output
echo   - React DevTools integration
echo   - Source maps enabled
echo   - Error stack traces preserved
echo   - Real-time error notifications in app
echo.
echo ========================================
echo.

set ANDROID_HOME=D:\Android\Sdk
set PATH=%PATH%;D:\Android\Sdk\platform-tools;D:\Android\Sdk\emulator

echo [1/5] Checking ADB connection...
adb devices
echo.

echo [2/5] Clearing Metro cache for clean start...
npx expo start --clear >nul 2>&1
timeout /t 2 /nobreak >nul
echo Cache cleared.
echo.

echo [3/5] Enabling debug mode features...
echo   - Error boundaries active
echo   - Error logger recording all errors
echo   - Debug tab shows live error count
echo   - Toast notifications for new errors
echo.

echo [4/5] Starting Metro bundler in DEBUG mode...
echo.
echo ========================================
echo DEBUG FEATURES ACTIVE
echo ========================================
echo.
echo IN YOUR APP:
echo   1. Check the DEBUG tab (bug icon) - shows error count badge
echo   2. Errors appear as toast notifications at top
echo   3. Tap toasts to jump to Debug tab
echo   4. Tap any error to copy full details
echo   5. Use "Copy All" to copy all errors at once
echo.
echo IN THIS TERMINAL:
echo   - Errors and warnings are highlighted
echo   - Stack traces include source file names
echo   - Network requests are logged
echo.
echo ========================================
echo.

echo [5/5] Launching...
echo.

REM Start Expo with development mode explicitly enabled (Expo Go)
npx expo start --android --clear

echo.
echo Debug session ended.
pause
