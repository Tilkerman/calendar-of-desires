import './WelcomeScreen.css';
import { useI18n } from '../../i18n';
import mandalaSvg from '../../assets/mandala.svg';
import mandalaPng from '../../assets/Мандала.png';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const { t } = useI18n();

  return (
    <div className="welcome-screen">
      <header className="welcome-header">
        {/* Логотип Lumi */}
        <h1 className="welcome-logo">Lumi</h1>
      </header>

      <main className="welcome-center" aria-hidden="true">
        {/* Декоративный элемент */}
        <div className="welcome-mandala">
          <picture className="welcome-mandala-picture">
            <source srcSet={mandalaSvg} type="image/svg+xml" />
            <img
              className="welcome-mandala-img"
              src={mandalaPng}
              alt=""
              draggable={false}
              loading="eager"
            />
          </picture>
        </div>
      </main>

      <footer className="welcome-footer">
        {/* Мотивационный текст */}
        <p className="welcome-motivation">{t('welcome.motivation')}</p>

        {/* Кнопка START */}
        <button onClick={onStart} className="welcome-start-button">
          {t('welcome.start')}
        </button>
      </footer>
    </div>
  );
}
