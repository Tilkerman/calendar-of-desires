# Auto deploy to GitHub Pages
Write-Host "Setting up GitHub Pages..." -ForegroundColor Green
Write-Host ""

$githubUsername = Read-Host "Enter your GitHub username"

if (-not $githubUsername) {
    Write-Host "GitHub username is required!" -ForegroundColor Red
    exit 1
}

# Check existing remote
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "Remote 'origin' already exists: $existingRemote" -ForegroundColor Yellow
    git remote remove origin
}

# Add remote
$repoUrl = "https://github.com/$githubUsername/calendar-of-desires.git"
Write-Host "Adding remote repository..." -ForegroundColor Cyan
git remote add origin $repoUrl

# Rename branch to main
Write-Host "Renaming branch to main..." -ForegroundColor Cyan
git branch -M main

Write-Host ""
Write-Host "Local setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Create repository on GitHub: https://github.com/new" -ForegroundColor White
Write-Host "   Name: calendar-of-desires" -ForegroundColor White
Write-Host "   Type: Public" -ForegroundColor White
Write-Host "   Do NOT add README, .gitignore or license!" -ForegroundColor White
Write-Host ""
Write-Host "2. Press Enter after creating repository to push code..."
$null = Read-Host

# Push code
Write-Host "Pushing code to GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Code pushed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Enable GitHub Pages:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://github.com/$githubUsername/calendar-of-desires/settings/pages" -ForegroundColor Cyan
    Write-Host "2. Source: Branch gh-pages (or main), Folder: / (root)" -ForegroundColor White
    Write-Host "3. Enable GitHub Actions: Settings -> Actions -> General -> Read and write permissions" -ForegroundColor White
    Write-Host ""
    Write-Host "Your app will be available at:" -ForegroundColor Green
    Write-Host "https://$githubUsername.github.io/calendar-of-desires/" -ForegroundColor Cyan
} else {
    Write-Host "Error pushing code. Make sure repository exists on GitHub." -ForegroundColor Red
}

