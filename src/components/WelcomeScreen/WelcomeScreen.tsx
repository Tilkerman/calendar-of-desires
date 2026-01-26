import './WelcomeScreen.css';
import { useI18n } from '../../i18n';
import mandalaPng from '../../assets/Мандала.png';
import logoSvg from '../../assets/logo.svg';
import motivationSvg from '../../assets/motivation.svg';
import startButtonSvg from '../../assets/start-button.svg';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const { t } = useI18n();

  return (
    <div className="welcome-screen">
      <header className="welcome-header">
        {/* Логотип Lumi (из макета) */}
        <h1 className="welcome-logo">
          <img className="welcome-logo-img" src={logoSvg} alt="Lumi" draggable={false} />
        </h1>
      </header>

      <main className="welcome-center" aria-hidden="true">
        {/* Декоративный элемент */}
        <div className="welcome-mandala">
          <img className="welcome-mandala-img" src={mandalaPng} alt="" draggable={false} loading="eager" />
        </div>
      </main>

      <footer className="welcome-footer">
        {/* Мотивационный текст (из макета) */}
        <div className="welcome-motivation">
          <img className="welcome-motivation-img" src={motivationSvg} alt="" aria-hidden="true" draggable={false} />
          <span className="sr-only">{t('welcome.motivation')}</span>
        </div>

        {/* Кнопка START */}
        <button onClick={onStart} className="welcome-start-button" aria-label={t('welcome.start')}>
          <img className="welcome-start-button-img" src={startButtonSvg} alt="" aria-hidden="true" draggable={false} />
        </button>
      </footer>
    </div>
  );
}
