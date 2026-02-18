import './Header.css';
import { useI18n } from '../../i18n';
import type { ReactNode } from 'react';
import logoMark from '../../assets/group-29.svg';

interface HeaderProps {
  onSettingsClick?: () => void;
  onLogoClick?: () => void;
  leftSlot?: ReactNode;
}

export default function Header({ onSettingsClick, onLogoClick, leftSlot }: HeaderProps) {
  const { t, locale, setLocale } = useI18n();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          {leftSlot}
          {/* Логотип */}
          {onLogoClick ? (
            <button
              className="header-logo-btn"
              onClick={onLogoClick}
              aria-label={t('header.home')}
              type="button"
            >
              <img className="header-logo-img" src={logoMark} alt={t('header.appName')} draggable={false} />
            </button>
          ) : (
            <img className="header-logo-img" src={logoMark} alt={t('header.appName')} draggable={false} />
          )}
        </div>

        <div className="header-center">
          <div className="header-lang-switcher" aria-label={t('header.langLabel')}>
            <button
              type="button"
              className={`header-lang-btn ${locale === 'ru' ? 'active' : ''}`}
              onClick={() => setLocale('ru')}
            >
              RU
            </button>
            <span className="header-lang-separator">|</span>
            <button
              type="button"
              className={`header-lang-btn ${locale === 'en' ? 'active' : ''}`}
              onClick={() => setLocale('en')}
            >
              EN
            </button>
          </div>
        </div>

        <div className="header-right">
          <button
            type="button"
            className="header-burger"
            onClick={onSettingsClick}
            aria-label={t('header.settings')}
          >
            <span className="header-burger-icon" aria-hidden="true">
              <span className="header-burger-line" />
              <span className="header-burger-line" />
              <span className="header-burger-line" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

