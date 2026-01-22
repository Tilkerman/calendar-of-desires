import './Header.css';
import { useI18n } from '../../i18n';
import HeaderActions from './HeaderActions';
import LogoIcon from './LogoIcon';
import type { ReactNode } from 'react';

interface HeaderProps {
  onSettingsClick?: () => void;
  onLogoClick?: () => void;
  leftSlot?: ReactNode;
}

export default function Header({ onSettingsClick, onLogoClick, leftSlot }: HeaderProps) {
  const { t } = useI18n();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          {leftSlot}
          {/* Логотип */}
          <button
            className="header-logo"
            onClick={onLogoClick}
            aria-label={t('header.home')}
            type="button"
          >
            <LogoIcon />
            <span className="logo-text">{t('header.appName')}</span>
          </button>
        </div>

        <HeaderActions onSettingsClick={onSettingsClick} />
      </div>
    </header>
  );
}

