import { useEffect, useState } from 'react';
import Header from '../Header/Header';
import './SettingsPages.css';
import { useI18n } from '../../i18n';

interface SettingsPageProps {
  onBack: () => void;
  onSettingsClick?: () => void;
}

export default function SettingsPage({ onBack, onSettingsClick }: SettingsPageProps) {
  const { locale, setLocale, t } = useI18n();
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'auto') return 'auto';
    return (saved === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
  });
  const [notifications, setNotifications] = useState(false);

  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };
      handleChange(mediaQuery);
      mediaQuery.addEventListener('change', handleChange);
      localStorage.setItem('theme', theme);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  return (
    <>
      <Header
        leftSlot={
          <button type="button" className="settings-page-back" onClick={onBack}>
            ← {t('common.back')}
          </button>
        }
        onSettingsClick={onSettingsClick}
      />
      <div className="settings-page">
        <div className="settings-page-content">
          <h1 className="settings-page-title">{t('settings.page.title')}</h1>

          <div className="settings-section">
            <h2 className="settings-section-title">{t('settings.page.language')}</h2>
            <div className="settings-option">
              <button
                type="button"
                className={`settings-toggle ${locale === 'ru' ? 'active' : ''}`}
                onClick={() => setLocale('ru')}
              >
                {t('header.lang.ru')}
              </button>
              <button
                type="button"
                className={`settings-toggle ${locale === 'en' ? 'active' : ''}`}
                onClick={() => setLocale('en')}
              >
                {t('header.lang.en')}
              </button>
            </div>
          </div>

          <div className="settings-section">
            <h2 className="settings-section-title">{t('settings.page.theme')}</h2>
            <div className="settings-option">
              <button
                type="button"
                className={`settings-toggle ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                {t('settings.page.themeLight')}
              </button>
              <button
                type="button"
                className={`settings-toggle ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                {t('settings.page.themeDark')}
              </button>
              <button
                type="button"
                className={`settings-toggle ${theme === 'auto' ? 'active' : ''}`}
                onClick={() => setTheme('auto')}
              >
                {t('settings.page.themeAuto')}
              </button>
            </div>
          </div>

          <div className="settings-section">
            <h2 className="settings-section-title">{t('settings.page.notifications')}</h2>
            <div className="settings-switch-container">
              <label className="settings-switch">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <span className="settings-switch-slider"></span>
              </label>
              <span className="settings-switch-label">{t('settings.page.notificationsLabel')}</span>
            </div>
            <p className="settings-hint">{t('settings.page.notificationsHint')}</p>
          </div>
        </div>
      </div>
    </>
  );
}

