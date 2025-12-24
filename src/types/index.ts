// Типы для Calendar of Desires

export interface Desire {
  id: string;
  title: string;
  deadline: string | null; // ISO date или null (ориентир по времени)
  imageUrl: string | null; // base64 или URL (можно несколько, храним как строку с разделителями)
  description: string; // эмоциональное описание "Как ты хочешь себя чувствовать?"
  createdAt: string; // ISO date
  isActive: boolean; // желание в фокусе сегодня
}

// Контакт с желанием за день
export interface Contact {
  id: string;
  desireId: string;
  date: string; // ISO date (YYYY-MM-DD)
  type: 'entry' | 'thought' | 'step'; // тип контакта: запись, мысли, шаг
  text: string | null; // текст записи или комментарий к шагу (опционально)
  createdAt: string; // ISO timestamp
}

// Тип контакта для отображения
export type ContactType = 'entry' | 'thought' | 'step';

// Состояние индикатора контакта за 7 дней
export type ContactIndicatorState = 'empty' | 'low' | 'medium' | 'full';






