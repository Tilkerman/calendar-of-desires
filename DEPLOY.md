# Инструкции по деплою

## Быстрый деплой на Vercel (рекомендуется)

1. Создайте репозиторий на GitHub:
   ```bash
   # Добавьте remote (замените YOUR_USERNAME на ваш GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/calendar-of-desires.git
   git branch -M main
   git push -u origin main
   ```

2. Перейдите на [vercel.com](https://vercel.com) и войдите через GitHub

3. Нажмите "New Project" и выберите ваш репозиторий

4. Vercel автоматически определит настройки:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. Нажмите "Deploy"

6. После деплоя вы получите ссылку вида: `https://your-project.vercel.app`

## Альтернатива: Netlify Drop

1. Перейдите на [app.netlify.com/drop](https://app.netlify.com/drop)

2. Перетащите папку `dist` из проекта

3. Получите ссылку для просмотра

## Локальный просмотр на телефоне

1. Узнайте IP адрес вашего компьютера:
   - Windows: `ipconfig` (IPv4 адрес)
   - Mac/Linux: `ifconfig` или `ip addr`

2. Запустите preview сервер:
   ```bash
   npm run preview -- --host
   ```

3. На телефоне откройте: `http://YOUR_IP:4173`

## Настройка PWA

Приложение уже настроено как PWA и может быть установлено на телефон:
- В браузере нажмите "Добавить на главный экран"
- Приложение будет работать офлайн

