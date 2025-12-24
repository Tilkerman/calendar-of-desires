# КРИТИЧНО: Включите GitHub Pages вручную!

Workflow падает потому что GitHub Pages не включен в настройках.

## Шаг 1: Включите GitHub Pages

1. Откройте: https://github.com/Tilkerman/calendar-of-desires/settings/pages

2. В разделе **"Build and deployment"**:
   - **Source**: выберите **"GitHub Actions"**
   - Если "GitHub Actions" недоступно, выберите **"Deploy from a branch"**
     - Branch: `gh-pages` или `main`
     - Folder: `/ (root)`

3. Нажмите **Save**

## Шаг 2: Включите GitHub Actions

1. Откройте: https://github.com/Tilkerman/calendar-of-desires/settings/actions

2. В разделе **"Workflow permissions"**:
   - Выберите **"Read and write permissions"**
   - Поставьте галочку **"Allow GitHub Actions to create and approve pull requests"**

3. Нажмите **Save**

## Шаг 3: Запустите workflow вручную

1. Откройте: https://github.com/Tilkerman/calendar-of-desires/actions

2. Найдите workflow "Deploy to GitHub Pages"

3. Нажмите на него, затем кнопку **"Run workflow"** → **"Run workflow"**

После этого workflow должен выполниться успешно!

