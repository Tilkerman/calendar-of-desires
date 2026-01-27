import './WelcomeScreen.css';
import { useI18n } from '../../i18n';
import mandalaPng from '../../assets/Мандала.png';
import logoSvg from '../../assets/logo.svg';
import LanguageToggle from '../LanguageToggle/LanguageToggle';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const { t } = useI18n();

  return (
    <div className="welcome-screen">
      <header className="onboarding-topbar">
        <div className="onboarding-topbar-inner">
          <LanguageToggle />
        </div>
      </header>

      <header className="welcome-header">
        {/* Логотип Lumi (из макета) */}
        <h1 className="welcome-logo">
          <img className="welcome-logo-img" src={logoSvg} alt="" aria-hidden="true" draggable={false} />
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
          <p className="welcome-motivation-text">{t('welcome.motivation')}</p>
        </div>

        {/* Кнопка START */}
        <button onClick={onStart} className="welcome-start-button" aria-label={t('welcome.start')}>
          <span className="welcome-start-button-text">{t('welcome.start')}</span>
        </button>
      </footer>
    </div>
  );
}
