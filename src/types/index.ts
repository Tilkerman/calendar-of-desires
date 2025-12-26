// Типы для Calendar of Desires

export interface DesireImage {
  id: string;
  url: string; // base64 или URL
  order: number; // порядок отображения (0, 1, 2, ...)
}

export interface Desire {
  id: string;
  title: string;
  deadline: string | null; // ISO date или null (ориентир по времени) - устаревшее, оставлено для совместимости
  imageUrl?: string | null; // base64 или URL (legacy, для обратной совместимости)
  images?: DesireImage[]; // массив изображений (до 6)
  description: string; // эмоциональное описание "Как ты хочешь себя чувствовать?"
  details: string | null; // подробное описание желания "Опиши своё желание"
  createdAt: string; // ISO date
  isActive: boolean; // желание в фокусе сегодня
}

// Контакт с желанием за день
export interface Contact {
  id: string;
  desireId: string;
  date: string; // ISO date (YYYY-MM-DD)
  type: 'entry' | 'note' | 'thought' | 'step'; // тип контакта: entry (legacy) = note (записи), мысли, шаг
  text: string | null; // текст записи или комментарий к шагу (опционально)
  createdAt: string; // ISO timestamp
  updatedAt?: string; // ISO timestamp (для отслеживания обновлений)
}

// Тип контакта для отображения
export type ContactType = 'entry' | 'note' | 'thought' | 'step';






