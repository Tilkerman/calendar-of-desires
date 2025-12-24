import type { DailyQuestion } from '../types';

// Вариативные вопросы дня для ритуала
export const dailyQuestions: DailyQuestion[] = [
  'Как сегодня ты был(а) ближе к этой версии своей жизни?',
  'Что сегодня напомнило тебе о желании?',
  'Какое ощущение было сегодня?',
  'Как ты сегодня проживал(а) это желание?',
  'Что сегодня приблизило тебя к желанию?',
  'Какое состояние было сегодня?',
  'Как сегодня ты чувствовал(а) это желание?',
  'Что сегодня было важным на пути к желанию?',
  'Как сегодня ты был(а) в контакте с желанием?',
  'Что сегодня наполнило тебя в связи с желанием?',
];

// Получить случайный вопрос дня
export function getDailyQuestion(): DailyQuestion {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  
  // Используем день года как seed для псевдослучайного выбора
  // Это гарантирует, что вопрос будет одинаковым в течение дня
  const index = dayOfYear % dailyQuestions.length;
  return dailyQuestions[index];
}




