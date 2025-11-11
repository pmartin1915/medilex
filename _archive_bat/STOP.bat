@echo off
echo.
echo Stopping all Metro/Node processes...
taskkill /F /IM node.exe >nul 2>&1
echo.
echo Done! All processes stopped.
echo.
pause
