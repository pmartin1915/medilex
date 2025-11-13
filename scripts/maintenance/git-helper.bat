@echo off
echo Git Helper - Simple Workflow
echo.
echo Current status:
git status --short
echo.
echo Choose an option:
echo 1. Add and commit iOS fix only
echo 2. Add and commit all changes
echo 3. Create new branch for current work
echo 4. Push current branch
echo 5. Show git log
echo.
set /p choice="Enter choice (1-5): "

if "%choice%"=="1" (
    echo Adding iOS fix files...
    git add package.json package-lock.json
    git commit -m "Fix iOS runtime error - remove react-native-screens dependency"
    echo iOS fix committed!
)

if "%choice%"=="2" (
    echo Adding all changes...
    git add .
    git commit -m "Update: iOS fix and app enhancements"
    echo All changes committed!
)

if "%choice%"=="3" (
    set /p branch="Enter new branch name: "
    git checkout -b %branch%
    echo Created and switched to branch: %branch%
)

if "%choice%"=="4" (
    git push origin HEAD
    echo Pushed current branch!
)

if "%choice%"=="5" (
    git log --oneline -10
)

pause