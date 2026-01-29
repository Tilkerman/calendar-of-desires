import './WelcomeScreen.css';
import { useI18n } from '../../i18n';
import mandalaSvg from '../../assets/mandala.svg';

interface WelcomeScreenProps {
  onStart: () => void;
  onSettingsClick?: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const { t, locale, setLocale } = useI18n();

  return (
    <div className="welcome-screen">
      {/* Language switcher */}
      <div className="welcome-lang-switcher">
        <button
          type="button"
          className={`welcome-lang-btn ${locale === 'ru' ? 'active' : ''}`}
          onClick={() => setLocale('ru')}
        >
          RU
        </button>
        <span className="welcome-lang-separator">|</span>
        <button
          type="button"
          className={`welcome-lang-btn ${locale === 'en' ? 'active' : ''}`}
          onClick={() => setLocale('en')}
        >
          EN
        </button>
      </div>

      {/* Logo */}
      <h1 className="welcome-logo">{t('welcome.title')}</h1>

      {/* Mandala */}
      <div className="welcome-mandala" aria-hidden="true">
        <img className="welcome-mandala-img" src={mandalaSvg} alt="" draggable={false} loading="eager" />
      </div>

      {/* Subtitle */}
      <div className="welcome-subtitle">
        <div className="welcome-subtitle-line">{t('welcome.subtitle.line1')}</div>
        <div className="welcome-subtitle-line">{t('welcome.subtitle.line2')}</div>
      </div>

      {/* Primary button */}
      <button onClick={onStart} className="welcome-button">
        {t('welcome.button')}
      </button>
    </div>
  );
}
