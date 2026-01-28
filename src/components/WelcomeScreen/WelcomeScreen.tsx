import './WelcomeScreen.css';
import { useI18n } from '../../i18n';
import logoMark from '../../assets/group-29.svg';
import mandalaPng from '../../assets/Мандала.png';
import welcomeButton from '../../assets/welcome-button.svg';
import LanguageToggle from '../LanguageToggle/LanguageToggle';

interface WelcomeScreenProps {
  onStart: () => void;
  onSettingsClick?: () => void;
}

export default function WelcomeScreen({ onStart, onSettingsClick }: WelcomeScreenProps) {
  const { t } = useI18n();

  return (
    <div className="welcome-screen">
      <header className="welcome-header">
        <div className="welcome-header-left">
          <img className="welcome-header-logo" src={logoMark} alt="LUMI" draggable={false} />
        </div>
        <div className="welcome-header-center" />
        <div className="welcome-header-right">
          <LanguageToggle />
          <button
            type="button"
            className="welcome-burger"
            onClick={onSettingsClick}
            aria-label={t('header.settings')}
          >
            <span className="welcome-burger-icon" aria-hidden="true">
              <span className="welcome-burger-line" />
              <span className="welcome-burger-line" />
              <span className="welcome-burger-line" />
            </span>
          </button>
        </div>
      </header>

      <div className="welcome-hero-logo-wrap">
        <img className="welcome-hero-logo" src={logoMark} alt="LUMI" draggable={false} />
      </div>

      <div className="welcome-mandala" aria-hidden="true">
        <img className="welcome-mandala-img" src={mandalaPng} alt="" draggable={false} loading="eager" />
      </div>

      {/* Мотивационный текст */}
      <p className="welcome-motivation">{t('welcome.motivation')}</p>

      {/* Кнопка */}
      <div className="welcome-bottom">
        <button
          type="button"
          onClick={onStart}
          className="welcome-start-button"
          aria-label={t('welcome.start')}
        >
          <img className="welcome-start-button__bg" src={welcomeButton} alt="" aria-hidden="true" draggable={false} />
          <span className="welcome-start-button__text">{t('welcome.start')}</span>
        </button>
      </div>
    </div>
  );
}
