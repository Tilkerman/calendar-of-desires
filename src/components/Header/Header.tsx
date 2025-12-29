import './Header.css';
import { useI18n } from '../../i18n';
import HeaderActions from './HeaderActions';

interface HeaderProps {
  onSettingsClick?: () => void;
  onLogoClick?: () => void;
}

export default function Header({ onSettingsClick, onLogoClick }: HeaderProps) {
  const { t } = useI18n();

  return (
    <header className="app-header">
      <div className="header-content">
        {/* Логотип */}
        <button 
          className="header-logo" 
          onClick={onLogoClick}
          aria-label={t('header.home')}
        >
          <span className="logo-icon">📅</span>
          <span className="logo-text">{t('header.appName')}</span>
        </button>

        <HeaderActions onSettingsClick={onSettingsClick} />
      </div>
    </header>
  );
}

