# Быстрый деплой - выполните эти команды

## Шаг 1: Замените YOUR_USERNAME на ваш GitHub username и выполните:

```powershell
cd C:\Users\z108\PWA\Calendar-of-Desires
$username = "YOUR_USERNAME"  # ЗАМЕНИТЕ НА ВАШ GITHUB USERNAME
git remote add origin "https://github.com/$username/calendar-of-desires.git"
git branch -M main
git push -u origin main
```

## Шаг 2: Создайте репозиторий на GitHub

1. Откройте: https://github.com/new
2. Название: `calendar-of-desires`
3. Тип: **Public**
4. НЕ добавляйте README, .gitignore, лицензию
5. Нажмите "Create repository"

## Шаг 3: После создания репозитория выполните push:

```powershell
git push -u origin main
```

## Шаг 4: Включите GitHub Pages

1. Откройте: https://github.com/YOUR_USERNAME/calendar-of-desires/settings/pages
2. Source: Branch `gh-pages` (или `main`), Folder `/ (root)`
3. Save

## Шаг 5: Включите GitHub Actions

1. Settings → Actions → General
2. Workflow permissions → ✅ Read and write permissions
3. Save

## Готово! Приложение будет доступно по адресу:

**https://YOUR_USERNAME.github.io/calendar-of-desires/**

