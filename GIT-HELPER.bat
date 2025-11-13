@echo off
title Git Helper
echo.
echo ========================================
echo   Git Helper - Simple Workflow
echo ========================================
echo.
echo What do you want to do?
echo.
echo 1. Check status (see what changed)
echo 2. Commit all changes
echo 3. Push to remote
echo 4. Pull latest changes
echo 5. Full sync (commit + push)
echo 6. View recent commits
echo 7. Undo last commit (keep changes)
echo 8. Emergency: Reset to remote
echo.
set /p choice="Enter choice (1-8): "

if "%choice%"=="1" (
    echo.
    echo Current branch and status:
    git branch
    echo.
    git status
    echo.
    pause
    exit /b
)

if "%choice%"=="2" (
    echo.
    set /p message="Enter commit message: "
    git add .
    git commit -m "!message!"
    echo.
    echo ✓ Changes committed!
    echo.
    pause
    exit /b
)

if "%choice%"=="3" (
    echo.
    echo Pushing to remote...
    git push
    echo.
    echo ✓ Pushed to remote!
    echo.
    pause
    exit /b
)

if "%choice%"=="4" (
    echo.
    echo Pulling latest changes...
    git pull
    echo.
    echo ✓ Pulled latest changes!
    echo.
    pause
    exit /b
)

if "%choice%"=="5" (
    echo.
    set /p message="Enter commit message: "
    echo.
    echo [1/3] Adding all changes...
    git add .
    echo [2/3] Committing...
    git commit -m "!message!"
    echo [3/3] Pushing to remote...
    git push
    echo.
    echo ✓ Full sync complete!
    echo.
    pause
    exit /b
)

if "%choice%"=="6" (
    echo.
    echo Recent commits:
    git log --oneline -10
    echo.
    pause
    exit /b
)

if "%choice%"=="7" (
    echo.
    echo Undoing last commit (keeping changes)...
    git reset --soft HEAD~1
    echo.
    echo ✓ Last commit undone! Changes are still in your files.
    echo.
    pause
    exit /b
)

if "%choice%"=="8" (
    echo.
    echo ⚠️  WARNING: This will discard ALL local changes!
    set /p confirm="Are you sure? Type YES to confirm: "
    if /i not "!confirm!"=="YES" (
        echo Cancelled.
        pause
        exit /b
    )
    echo.
    echo Fetching remote...
    git fetch origin
    echo Resetting to remote...
    for /f "tokens=*" %%i in ('git branch --show-current') do set branch=%%i
    git reset --hard origin/!branch!
    echo.
    echo ✓ Reset to remote state!
    echo.
    pause
    exit /b
)

echo Invalid choice!
pause
