import './IntroScreen.css';
import { useI18n } from '../../i18n';
import mandalaSvg from '../../assets/mandala.svg';

interface IntroScreenProps {
  onGo: () => void;
  onSettingsClick?: () => void;
}

export default function IntroScreen({ onGo }: IntroScreenProps) {
  const { t, locale, setLocale } = useI18n();

  return (
    <div className="intro-screen">
      {/* Language switcher (must be centered like Welcome) */}
      <div className="intro-lang-switcher">
        <button
          type="button"
          className={`intro-lang-btn ${locale === 'ru' ? 'active' : ''}`}
          onClick={() => setLocale('ru')}
        >
          RU
        </button>
        <span className="intro-lang-separator">|</span>
        <button
          type="button"
          className={`intro-lang-btn ${locale === 'en' ? 'active' : ''}`}
          onClick={() => setLocale('en')}
        >
          EN
        </button>
      </div>

      <main className="intro-content">
        <div className="intro-upper">
          <h1 className="intro-title">{t('intro.title')}</h1>

          <div className="intro-steps-wrap" aria-label={t('tutorial.welcome.title')}>
            <ul className="intro-steps">
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
          </div>

          <div className="intro-mandala" aria-hidden="true">
            <img className="intro-mandala-img" src={mandalaSvg} alt="" draggable={false} loading="eager" />
          </div>
        </div>

        <div className="intro-lower">
          <div className="intro-footer-wrap">
            <p className="intro-footer-text">{t('intro.footer')}</p>
          </div>

          <div className="intro-bottom">
            <button
              className="intro-go"
              onClick={onGo}
              aria-label={t('intro.go')}
              type="button"
            >
              <span className="intro-go-text">{t('intro.go')}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}


