import type { ContactIndicatorState } from '../types';

/**
 * Определяет состояние индикатора контакта на основе количества дней с контактом за 7 дней
 * @param days - количество дней с контактом (0-7)
 * @returns состояние индикатора
 */
export function getContactIndicatorState(days: number): ContactIndicatorState {
  if (days === 0) return 'empty';      // 0/7 - серый, тонкий контур, opacity ~30%
  if (days >= 1 && days <= 3) return 'low';    // 1-3/7 - основной цвет, тонкий контур
  if (days >= 4 && days <= 6) return 'medium'; // 4-6/7 - основной цвет, жирный контур
  return 'full';                        // 7/7 - основной цвет, полная заливка
}

