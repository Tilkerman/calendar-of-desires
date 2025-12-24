@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   GitHub Pages Auto Deploy
echo ========================================
echo.

set /p GITHUB_USER="Enter your GitHub username: "

if "%GITHUB_USER%"=="" (
    echo Error: GitHub username is required!
    pause
    exit /b 1
)

echo.
echo Step 1: Checking existing remote...
git remote remove origin 2>nul

echo Step 2: Adding remote repository...
git remote add origin https://github.com/%GITHUB_USER%/calendar-of-desires.git

echo Step 3: Renaming branch to main...
git branch -M main

echo.
echo ========================================
echo   IMPORTANT: Create repository first!
echo ========================================
echo.
echo 1. Open: https://github.com/new
echo 2. Repository name: calendar-of-desires
echo 3. Type: Public
echo 4. DO NOT add README, .gitignore or license
echo 5. Click "Create repository"
echo.
set /p CONTINUE="Press Enter after creating repository to push code..."

echo.
echo Step 4: Pushing code to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS! Code pushed!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Enable GitHub Pages:
    echo    https://github.com/%GITHUB_USER%/calendar-of-desires/settings/pages
    echo    Source: Branch gh-pages, Folder: / (root)
    echo.
    echo 2. Enable GitHub Actions:
    echo    Settings -^> Actions -^> General
    echo    Workflow permissions -^> Read and write
    echo.
    echo Your app will be at:
    echo https://%GITHUB_USER%.github.io/calendar-of-desires/
    echo.
) else (
    echo.
    echo Error: Failed to push code.
    echo Make sure repository exists on GitHub.
    echo.
)

pause

