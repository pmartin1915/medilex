@echo off
echo.
echo Restarting app...
call STOP.bat
timeout /t 2 /nobreak >nul
call GO.bat
