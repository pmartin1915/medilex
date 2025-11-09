@echo off
echo ========================================
echo Android Environment Setup
echo ========================================
echo.
echo This will set your Android SDK environment variables PERMANENTLY.
echo.
echo Current Android SDK location (based on your other .bat files):
echo D:\Android\Sdk
echo.
echo If this is CORRECT, press any key to continue.
echo If this is WRONG, press Ctrl+C and edit this file first.
echo.
pause

echo.
echo Setting ANDROID_HOME environment variable...
setx ANDROID_HOME "D:\Android\Sdk"

echo.
echo Adding Android tools to PATH...
setx PATH "%PATH%;D:\Android\Sdk\platform-tools;D:\Android\Sdk\emulator;D:\Android\Sdk\tools;D:\Android\Sdk\tools\bin"

echo.
echo ========================================
echo SUCCESS!
echo ========================================
echo.
echo Your Android environment is now configured permanently.
echo.
echo IMPORTANT: You MUST close and reopen your terminal for changes to take effect.
echo.
echo After reopening terminal, verify with these commands:
echo   echo %ANDROID_HOME%
echo   adb version
echo   emulator -version
echo.
echo Then you can simply run: npm start
echo.
pause
