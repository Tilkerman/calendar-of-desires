import './IntroScreen.css';
import { useI18n } from '../../i18n';
import LanguageToggle from '../LanguageToggle/LanguageToggle';
import mandalaPng from '../../assets/Мандала.png';
import logoMark from '../../assets/group-29.svg';
import welcomeButton from '../../assets/welcome-button.svg';

interface IntroScreenProps {
  onGo: () => void;
  onSettingsClick?: () => void;
}

export default function IntroScreen({ onGo, onSettingsClick }: IntroScreenProps) {
  const { t } = useI18n();

  return (
    <div className="intro-screen">
      <header className="intro-header">
        <div className="intro-header-left">
          <img className="intro-header-logo" src={logoMark} alt="LUMI" draggable={false} />
        </div>
        <div className="intro-header-center" />
        <div className="intro-header-right">
          <LanguageToggle />
          <button
            type="button"
            className="intro-burger"
            onClick={onSettingsClick}
            aria-label={t('header.settings')}
          >
            <span className="intro-burger-icon" aria-hidden="true">
              <span className="intro-burger-line" />
              <span className="intro-burger-line" />
              <span className="intro-burger-line" />
            </span>
          </button>
        </div>
      </header>

      <main className="intro-content">
        <h1 className="intro-title">{t('intro.title')}</h1>

        <ul className="intro-steps" aria-label={t('tutorial.welcome.title')}>
          <li className="intro-step">
            <span className="intro-checkbox" aria-hidden="true" />
            <span className="intro-step-text">{t('intro.step1')}</span>
          </li>
          <li className="intro-step">
            <span className="intro-checkbox" aria-hidden="true" />
            <span className="intro-step-text">{t('intro.step2')}</span>
          </li>
          <li className="intro-step">
            <span className="intro-checkbox" aria-hidden="true" />
            <span className="intro-step-text">{t('intro.step3')}</span>
          </li>
        </ul>

        <div className="intro-mandala" aria-hidden="true">
          <img className="intro-mandala-img" src={mandalaPng} alt="" draggable={false} loading="eager" />
        </div>

        <p className="intro-footer-text">{t('intro.footer')}</p>

        <div className="intro-bottom">
          <button className="intro-go" onClick={onGo} aria-label={t('intro.go')} type="button">
            <img className="intro-go-bg" src={welcomeButton} alt="" aria-hidden="true" draggable={false} />
            <span className="intro-go-text">{t('intro.go')}</span>
          </button>
        </div>
      </main>
    </div>
  );
}


