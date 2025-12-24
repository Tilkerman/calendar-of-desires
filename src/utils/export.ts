import type { Desire, DailyEntry } from '../types';
import { formatDate, formatDateTime } from './date';

export function exportToText(desire: Desire, entries: DailyEntry[]): string {
  let text = `КАЛЕНДАРЬ ЖЕЛАНИЙ\n`;
  text += `==================\n\n`;
  
  text += `ЖЕЛАНИЕ\n`;
  text += `--------\n`;
  text += `Название: ${desire.title}\n`;
  
  if (desire.deadline) {
    text += `Дедлайн: ${formatDate(desire.deadline)}\n`;
  }
  
  if (desire.description) {
    text += `\nОписание:\n${desire.description}\n`;
  }
  
  text += `\nСоздано: ${formatDate(desire.createdAt)}\n`;
  
  text += `\n\nИСТОРИЯ ПУТИ\n`;
  text += `------------\n\n`;
  
  if (entries.length === 0) {
    text += `Записей пока нет.\n`;
  } else {
    entries.forEach((entry, index) => {
      text += `${index + 1}. ${formatDate(entry.date)}\n`;
      
      if (entry.type === 'view') {
        text += `   [Момент присутствия]\n`;
      } else {
        if (entry.text) {
          text += `   ${entry.text}\n`;
        }
        if (entry.closenessRating !== null) {
          text += `   Близость: ${entry.closenessRating}/10\n`;
        }
      }
      
      text += `   ${formatDateTime(entry.createdAt)}\n\n`;
    });
  }
  
  text += `\n---\n`;
  text += `Экспортировано: ${new Date().toLocaleString('ru-RU')}\n`;
  
  return text;
}

export function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}




