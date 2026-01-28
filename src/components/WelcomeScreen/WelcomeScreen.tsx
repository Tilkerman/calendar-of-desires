import './WelcomeScreen.css';
import { useI18n } from '../../i18n';

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
      <h1 className="welcome-logo">
        {t('welcome.title')}
      </h1>

      {/* Mandala */}
      <div className="welcome-mandala">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {/* Outer circle */}
          <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          
          {/* Inner circles */}
          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <circle cx="100" cy="100" r="55" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
          <circle cx="100" cy="100" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
          
          {/* Petals / rays */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45) * Math.PI / 180;
            const x1 = 100 + Math.cos(angle) * 25;
            const y1 = 100 + Math.sin(angle) * 25;
            const x2 = 100 + Math.cos(angle) * 70;
            const y2 = 100 + Math.sin(angle) * 70;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.4"
              />
            );
          })}
          
          {/* Decorative dots */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 22.5) * Math.PI / 180;
            const r = 80;
            const x = 100 + Math.cos(angle) * r;
            const y = 100 + Math.sin(angle) * r;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="1.5"
                fill="currentColor"
                opacity="0.5"
              />
            );
          })}
          
          {/* Center dot */}
          <circle cx="100" cy="100" r="3" fill="currentColor" opacity="0.6" />
        </svg>
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
      >
        {t('welcome.button')}
      </button>
    </div>
  );
}
