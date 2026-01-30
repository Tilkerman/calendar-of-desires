import './WelcomeScreen.css';
import { useI18n } from '../../i18n';
import mandalaSvg from '../../assets/mandala.svg';
import logoMark from '../../assets/group-29.svg';

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
      <img className="welcome-logo-img" src={logoMark} alt={t('welcome.title')} draggable={false} />

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
      <button
        onClick={onStart}
        className="welcome-button"
        type="button"
        aria-label={t('welcome.button')}
      >
        <span className="welcome-button-text">{t('welcome.button')}</span>
      </button>
    </div>
  );
}
