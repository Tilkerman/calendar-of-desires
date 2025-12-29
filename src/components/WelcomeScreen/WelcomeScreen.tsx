import './WelcomeScreen.css';
import { useI18n } from '../../i18n';

interface WelcomeScreenProps {
  onCreateDesire: () => void;
}

export default function WelcomeScreen({ onCreateDesire }: WelcomeScreenProps) {
  const { t } = useI18n();

  return (
    <div className="welcome-screen">
      {/* Заголовок */}
      <h1 className="welcome-title">
        {t('welcome.title')}
      </h1>

      {/* Мотивационный текст */}
      <p className="welcome-motivation">
        {t('welcome.motivation')}
      </p>

      {/* Список действий */}
      <ul className="welcome-list">
        <li>{t('welcome.list.item1')}</li>
        <li>{t('welcome.list.item2')}</li>
        <li>{t('welcome.list.item3')}</li>
      </ul>

      {/* Основное действие */}
      <div className="welcome-actions">
        <button
          onClick={onCreateDesire}
          className="welcome-button"
        >
          {t('welcome.cta')}
        </button>
      </div>

      {/* Пожелание удачи */}
      <p className="welcome-wish">
        {t('welcome.wish')}
      </p>

      {/* Сердечко */}
      <div className="welcome-heart">❤️</div>
    </div>
  );
}
