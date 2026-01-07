import { useState } from 'react';
import Header from '../Header/Header';
import './SettingsPages.css';
import { useI18n } from '../../i18n';
import { feedbackService } from '../../services/db';

interface FeedbackPageProps {
  onBack: () => void;
  onSettingsClick?: () => void;
}

export default function FeedbackPage({ onBack, onSettingsClick }: FeedbackPageProps) {
  const { t } = useI18n();
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendViaEmail = (text: string, rating: number | null) => {
    const subject = encodeURIComponent(t('settings.feedback.emailSubject'));
    const ratingText = rating ? `\n\n${t('settings.feedback.rating')}: ${rating}/5 ⭐` : '';
    const footer = t('settings.feedback.emailFooter');
    const body = encodeURIComponent(`${text}${ratingText}\n\n---\n${footer}`);
    // Email можно настроить через переменную окружения или оставить пустым (пользователь введёт сам)
    const email = import.meta.env.VITE_FEEDBACK_EMAIL || '';
    if (email) {
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    } else {
      // Если email не настроен, открываем mailto без адреса (пользователь введёт сам)
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
  };

  const sendViaTelegram = async (text: string, rating: number | null) => {
    // Telegram Bot API - нужен токен бота
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID || '';
    
    if (!botToken || !chatId) {
      // Если токен не настроен, используем mailto как fallback
      sendViaEmail(text, rating);
      return;
    }

    try {
      const ratingText = rating ? `\n\n⭐ Оценка: ${rating}/5` : '';
      const message = `📝 Обратная связь из "Календарь желаний"\n\n${text}${ratingText}`;
      
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        throw new Error('Telegram API error');
      }
    } catch (error) {
      console.error('Ошибка отправки в Telegram:', error);
      // Fallback на email
      sendViaEmail(text, rating);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const feedbackText = feedback.trim();
      // Сохраняем обратную связь в IndexedDB
      await feedbackService.saveFeedback(feedbackText, rating);
      
      // Предлагаем отправить на email или Telegram
      const sendChoice = window.confirm(
        t('settings.feedback.sendChoice')
      );

      if (sendChoice) {
        // Пробуем отправить в Telegram, если настроено, иначе email
        await sendViaTelegram(feedbackText, rating);
      }

      alert(t('settings.feedback.thanks'));
      setFeedback('');
      setRating(null);
    } catch (error) {
      console.error('Ошибка при сохранении обратной связи:', error);
      alert('Не удалось сохранить обратную связь. Попробуйте ещё раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header
        leftSlot={
          <button type="button" className="settings-page-back" onClick={onBack}>
            ← {t('common.back')}
          </button>
        }
        onSettingsClick={onSettingsClick}
      />
      <div className="settings-page">
        <div className="settings-page-content">
          <h1 className="settings-page-title">{t('settings.feedback.title')}</h1>

          <form className="feedback-form" onSubmit={handleSubmit}>
            <div className="feedback-field">
              <label htmlFor="feedback-text" className="feedback-label">
                {t('settings.feedback.label')}
              </label>
              <textarea
                id="feedback-text"
                className="feedback-textarea"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={t('settings.feedback.placeholder')}
                rows={8}
                required
              />
            </div>

            <div className="feedback-field">
              <label className="feedback-label">{t('settings.feedback.rating')}</label>
              <div className="feedback-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`feedback-star ${rating && star <= rating ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                    aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="feedback-submit"
              disabled={isSubmitting || !feedback.trim()}
            >
              {isSubmitting ? t('common.saving') : t('settings.feedback.submit')}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

