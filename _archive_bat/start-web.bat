@echo off
echo.
echo ========================================
echo   Healthcare Vocab App - Web Version
echo ========================================
echo.
echo Starting web development server...
echo.
echo The app will open in your browser at:
echo   http://localhost:8081
echo.
echo Hot reload is enabled - save files to see changes!
echo.
echo Press Ctrl+C to stop the server
echo.

REM Increase Node memory for Metro bundler
set NODE_OPTIONS=--max-old-space-size=4096

REM Start Expo web server
npx expo start --web

pause
