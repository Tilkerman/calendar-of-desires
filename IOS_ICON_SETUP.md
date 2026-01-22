# Настройка иконки для iOS

## Проблема
iOS Safari **не поддерживает SVG** для иконок приложения. Нужен PNG файл размером **180x180px**.

## Решение

### Вариант 1: Онлайн-конвертер (самый простой)

1. Откройте файл `public/apple-touch-icon.svg` в браузере
2. Используйте онлайн-конвертер:
   - https://cloudconvert.com/svg-to-png
   - https://convertio.co/svg-png/
   - Или любой другой SVG → PNG конвертер
3. Установите размер: **180x180px**
4. Сохраните как `apple-touch-icon.png` в папку `public/`

### Вариант 2: Через браузер (Chrome/Edge)

1. Откройте `public/apple-touch-icon.svg` в браузере
2. Нажмите F12 (DevTools)
3. Выберите элемент `<svg>`
4. Скриншот элемента (или используйте расширение для скриншота)
5. Обрежьте до 180x180px в любом редакторе

### Вариант 3: Через Node.js (если установлен ImageMagick)

```bash
npm install -g sharp-cli
sharp -i public/apple-touch-icon.svg -o public/apple-touch-icon.png --resize 180x180
```

### Вариант 4: Через Figma/Sketch/Photoshop

1. Импортируйте `public/apple-touch-icon.svg`
2. Экспортируйте как PNG 180x180px
3. Сохраните в `public/apple-touch-icon.png`

## После создания PNG

1. Убедитесь, что файл `public/apple-touch-icon.png` существует
2. Пересоберите проект: `npm run build`
3. Задеплойте на GitHub Pages
4. На iPhone: удалите старое приложение и установите заново

## Проверка

После деплоя проверьте:
- Откройте сайт на iPhone в Safari
- Нажмите "Поделиться" → "На экран Домой"
- Иконка должна отображаться с мандалой LUMI

