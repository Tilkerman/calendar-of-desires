// Утилиты для работы с датами

export function formatDate(date: string): string {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Проверяем, сегодня ли это
  if (d.toDateString() === today.toDateString()) {
    return 'Сегодня';
  }

  // Проверяем, вчера ли это
  if (d.toDateString() === yesterday.toDateString()) {
    return 'Вчера';
  }

  // Форматируем дату
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

export function formatDateTime(date: string): string {
  const d = new Date(date);
  return d.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}






