# Проверка статуса деплоя

## Просто проверьте:

1. **Откройте Actions**: https://github.com/Tilkerman/calendar-of-desires/actions
   - Должен быть workflow "Build and Deploy to GitHub Pages"
   - Если он выполняется - подождите 2-3 минуты
   - Если завершился успешно (зеленая галочка) - приложение готово!

2. **Проверьте приложение**: https://tilkerman.github.io/calendar-of-desires/
   - Если видите белый экран - возможно нужно подождать еще немного
   - Или проверьте консоль браузера (F12) на ошибки

## Если все еще не работает:

Возможно нужно вручную включить GitHub Pages:
1. https://github.com/Tilkerman/calendar-of-desires/settings/pages
2. Source: выберите "GitHub Actions" (если доступно)
3. Или "Deploy from a branch" → Branch: `gh-pages` → Save

Но обычно workflow делает это автоматически!

