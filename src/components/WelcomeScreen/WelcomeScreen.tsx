import './WelcomeScreen.css';
import { useI18n } from '../../i18n';
import logoMark from '../../assets/group-29.svg';
import mandalaPng from '../../assets/Мандала.png';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const { t } = useI18n();

  return (
    <div className="welcome-screen">
      <div className="welcome-top">
        <img className="welcome-logo-mark" src={logoMark} alt="LUMI" draggable={false} />
      </div>

      <div className="welcome-mandala" aria-hidden="true">
        <img className="welcome-mandala-img" src={mandalaPng} alt="" draggable={false} loading="eager" />
      </div>

      {/* Мотивационный текст */}
      <p className="welcome-motivation">{t('welcome.motivation')}</p>

      {/* Кнопка */}
      <button
        type="button"
        onClick={onStart}
        className="welcome-start-button"
        aria-label={t('welcome.start')}
      >
        <span className="welcome-start-button__text">{t('welcome.start')}</span>
      </button>
    </div>
  );
}
