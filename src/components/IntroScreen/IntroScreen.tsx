import './IntroScreen.css';
import { useI18n } from '../../i18n';
import LanguageToggle from '../LanguageToggle/LanguageToggle';
import mandalaPng from '../../assets/Мандала.png';

interface IntroScreenProps {
  onGo: () => void;
}

export default function IntroScreen({ onGo }: IntroScreenProps) {
  const { t } = useI18n();

  return (
    <div className="intro-screen">
      <header className="onboarding-topbar">
        <div className="onboarding-topbar-inner">
          <LanguageToggle />
        </div>
      </header>

      <main className="intro-stage">
        <div className="intro-mandala" aria-hidden="true">
          <div className="intro-mandala-circle">
            <img className="intro-mandala-img" src={mandalaPng} alt="" draggable={false} loading="eager" />
          </div>
        </div>

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
          <li className="intro-step">
            <span className="intro-checkbox" aria-hidden="true" />
            <span className="intro-step-text">{t('intro.step4')}</span>
          </li>
        </ul>

        <div className="intro-footer">
          <p className="intro-footer-text">{t('intro.footer')}</p>
        </div>

        <button className="intro-go" onClick={onGo} aria-label={t('intro.go')} type="button">
          <span className="intro-go-text">{t('intro.go')}</span>
        </button>
      </main>
    </div>
  );
}


