# Скрипт автоматического деплоя на GitHub Pages
Write-Host "🚀 Настройка GitHub Pages для Calendar of Desires" -ForegroundColor Green
Write-Host ""

# Проверка наличия git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git не установлен!" -ForegroundColor Red
    exit 1
}

# Получение информации о пользователе
$gitUser = git config --global user.name
$gitEmail = git config --global user.email

if (-not $gitUser) {
    Write-Host "⚠️  Git user.name не настроен" -ForegroundColor Yellow
    $gitUser = Read-Host "Введите ваше имя для Git"
    git config --global user.name $gitUser
}

if (-not $gitEmail) {
    Write-Host "⚠️  Git user.email не настроен" -ForegroundColor Yellow
    $gitEmail = Read-Host "Введите ваш email для Git"
    git config --global user.email $gitEmail
}

Write-Host ""
Write-Host "📝 Текущие настройки Git:" -ForegroundColor Cyan
Write-Host "   Имя: $gitUser"
Write-Host "   Email: $gitEmail"
Write-Host ""

# Запрос GitHub username
$githubUsername = Read-Host "Введите ваш GitHub username"

if (-not $githubUsername) {
    Write-Host "❌ GitHub username обязателен!" -ForegroundColor Red
    exit 1
}

# Проверка существования remote
$existingRemote = git remote get-url origin 2>$null

if ($existingRemote) {
    Write-Host "⚠️  Remote 'origin' уже существует: $existingRemote" -ForegroundColor Yellow
    $overwrite = Read-Host "Перезаписать? (y/n)"
    if ($overwrite -eq "y" -or $overwrite -eq "Y") {
        git remote remove origin
    } else {
        Write-Host "❌ Отменено" -ForegroundColor Red
        exit 1
    }
}

# Добавление remote
$repoUrl = "https://github.com/$githubUsername/calendar-of-desires.git"
Write-Host ""
Write-Host "🔗 Добавление remote репозитория..." -ForegroundColor Cyan
git remote add origin $repoUrl

# Переименование ветки в main
Write-Host "🌿 Переименование ветки в main..." -ForegroundColor Cyan
git branch -M main

# Показ инструкций
Write-Host ""
Write-Host "✅ Локальная настройка завершена!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Следующие шаги:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Создайте репозиторий на GitHub:" -ForegroundColor White
Write-Host "   https://github.com/new" -ForegroundColor Cyan
Write-Host "   Название: calendar-of-desires" -ForegroundColor White
Write-Host "   Тип: Public" -ForegroundColor White
Write-Host "   НЕ добавляйте README, .gitignore или лицензию!" -ForegroundColor White
Write-Host ""
Write-Host "2. После создания репозитория нажмите Enter для пуша кода..."
$null = Read-Host

# Push кода
Write-Host ""
Write-Host "📤 Отправка кода на GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Код успешно отправлен!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔧 Теперь включите GitHub Pages:" -ForegroundColor Yellow
    Write-Host "   1. Перейдите: https://github.com/$githubUsername/calendar-of-desires/settings/pages" -ForegroundColor Cyan
    Write-Host "   2. В разделе Source выберите:" -ForegroundColor White
    Write-Host "      - Branch: gh-pages (или main)" -ForegroundColor White
    Write-Host "      - Folder: / (root)" -ForegroundColor White
    Write-Host "   3. Нажмите Save" -ForegroundColor White
    Write-Host ""
    Write-Host "   4. Включите GitHub Actions:" -ForegroundColor White
    Write-Host "      Settings → Actions → General" -ForegroundColor White
    Write-Host "      Workflow permissions → Read and write permissions" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 После деплоя приложение будет доступно по адресу:" -ForegroundColor Green
    Write-Host "   https://$githubUsername.github.io/calendar-of-desires/" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Ошибка при отправке кода" -ForegroundColor Red
    Write-Host "   Убедитесь, что репозиторий создан на GitHub" -ForegroundColor Yellow
}
