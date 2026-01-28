import './WelcomeScreen.css';
import { useI18n } from '../../i18n';
import startButtonSvg from '../../assets/start-button.svg';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const { t } = useI18n();

  return (
    <div className="welcome-screen">
      {/* Логотип Lumi */}
      <h1 className="welcome-logo">
        Lumi
      </h1>

      {/* Мандала-подобный декоративный элемент */}
      <div className="welcome-mandala">
        <svg viewBox="0 0 200 200" className="welcome-mandala-svg">
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4ECDC4" />
              <stop offset="100%" stopColor="#FFE5B4" />
            </linearGradient>
          </defs>
          
          {/* Внешний круг */}
          <circle cx="100" cy="100" r="85" fill="none" stroke="url(#gradient1)" strokeWidth="2.5" opacity="0.7"/>
          
          {/* Внешние лепестки (8 больших) */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45) * Math.PI / 180;
            const x = 100 + 65 * Math.cos(angle);
            const y = 100 + 65 * Math.sin(angle);
            return (
              <ellipse
                key={`outer-${i}`}
                cx={x}
                cy={y}
                rx="18"
                ry="28"
                fill="none"
                stroke="url(#gradient1)"
                strokeWidth="2"
                opacity="0.8"
                transform={`rotate(${i * 45} 100 100)`}
              />
            );
          })}
          
          {/* Средний круг */}
          <circle cx="100" cy="100" r="50" fill="none" stroke="url(#gradient1)" strokeWidth="2" opacity="0.6"/>
          
          {/* Средние лепестки (8 меньших) */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45) * Math.PI / 180;
            const x = 100 + 35 * Math.cos(angle);
            const y = 100 + 35 * Math.sin(angle);
            return (
              <ellipse
                key={`middle-${i}`}
                cx={x}
                cy={y}
                rx="10"
                ry="18"
                fill="none"
                stroke="url(#gradient1)"
                strokeWidth="1.5"
                opacity="0.7"
                transform={`rotate(${i * 45 + 22.5} 100 100)`}
              />
            );
          })}
          
          {/* Внутренний круг */}
          <circle cx="100" cy="100" r="25" fill="none" stroke="url(#gradient1)" strokeWidth="1.5" opacity="0.5"/>
          
          {/* Центральная точка */}
          <circle cx="100" cy="100" r="8" fill="url(#gradient1)" opacity="0.6"/>
        </svg>
      </div>

      {/* Мотивационный текст */}
      <p className="welcome-motivation">
        {t('welcome.motivation')}
      </p>

      {/* Кнопка START */}
      <button
        type="button"
        onClick={onStart}
        className="welcome-start-button"
        aria-label={t('welcome.start')}
      >
        <img
          className="welcome-start-button__img"
          src={startButtonSvg}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      </button>
    </div>
  );
}
