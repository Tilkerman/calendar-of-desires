import { useEffect, useState } from 'react';
import Header from '../Header/Header';
import './SettingsPages.css';
import { useI18n } from '../../i18n';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  areNotificationsEnabled,
  setNotificationsEnabled,
  getNotificationTime,
  setNotificationTime,
  showTestNotification,
  hasAskedForPermission,
} from '../../utils/notifications';
import { restartReminderScheduler, stopReminderScheduler } from '../../services/reminderScheduler';

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
  const [notifications, setNotifications] = useState(() => areNotificationsEnabled());
  const [notificationTime, setNotificationTimeState] = useState(() => getNotificationTime());
  const [permission, setPermission] = useState<NotificationPermission>(() => getNotificationPermission());
  const [isRequesting, setIsRequesting] = useState(false);
  const [testNotificationError, setTestNotificationError] = useState<string | null>(null);

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

  // Обновляем статус разрешения при изменении
  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      // Если включаем, нужно проверить разрешение
      if (permission === 'default' || permission === 'denied') {
        setIsRequesting(true);
        try {
          const newPermission = await requestNotificationPermission();
          setPermission(newPermission);
          
          if (newPermission !== 'granted') {
            // Разрешение не предоставлено, не включаем уведомления
            setNotifications(false);
            setIsRequesting(false);
            return;
          }
        } catch (error) {
          console.error('Ошибка при запросе разрешения:', error);
          setNotifications(false);
          setIsRequesting(false);
          return;
        } finally {
          setIsRequesting(false);
        }
      }
      
      // Включаем уведомления
      setNotifications(true);
      setNotificationsEnabled(true);
      
      // Ждем готовности service worker перед запуском планировщика
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.ready;
          restartReminderScheduler();
        } catch (error) {
          console.error('Ошибка при запуске планировщика:', error);
        }
      } else {
        restartReminderScheduler();
      }
    } else {
      // Выключаем уведомления
      setNotifications(false);
      setNotificationsEnabled(false);
      stopReminderScheduler();
    }
  };

  const handleTimeChange = (time: string) => {
    setNotificationTimeState(time);
    setNotificationTime(time);
    
    // Если уведомления включены, перезапускаем планировщик с новым временем
    if (notifications) {
      restartReminderScheduler();
    }
  };

  const handleTestNotification = async () => {
    setTestNotificationError(null);
    try {
      await showTestNotification();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setTestNotificationError(errorMessage);
    }
  };

  const isNotificationAvailable = isNotificationSupported();
  const canEnableNotifications = permission === 'granted' || (permission === 'default' && !hasAskedForPermission());

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
            
            {!isNotificationAvailable && (
              <p className="settings-hint settings-hint-error">
                {t('settings.page.notificationsNotSupported')}
              </p>
            )}

            {isNotificationAvailable && permission === 'denied' && (
              <p className="settings-hint settings-hint-error">
                {t('settings.page.notificationsDenied')}
              </p>
            )}

            {isNotificationAvailable && canEnableNotifications && (
              <>
                <div className="settings-switch-container">
                  <label className="settings-switch">
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={(e) => handleNotificationToggle(e.target.checked)}
                      disabled={isRequesting}
                    />
                    <span className="settings-switch-slider"></span>
                  </label>
                  <span className="settings-switch-label">{t('settings.page.notificationsLabel')}</span>
                </div>

                {notifications && permission === 'granted' && (
                  <>
                    <div className="settings-time-container">
                      <label className="settings-time-label">
                        {t('settings.page.notificationTime')}
                      </label>
                      <input
                        type="time"
                        className="settings-time-input"
                        value={notificationTime}
                        onChange={(e) => handleTimeChange(e.target.value)}
                      />
                    </div>

                    <button
                      type="button"
                      className="settings-test-button"
                      onClick={handleTestNotification}
                    >
                      {t('settings.page.testNotification')}
                    </button>

                    {testNotificationError && (
                      <p className="settings-hint settings-hint-error">
                        {testNotificationError}
                      </p>
                    )}
                  </>
                )}

                {!notifications && permission === 'granted' && (
                  <p className="settings-hint">
                    {t('settings.page.notificationsHintEnabled')}
                  </p>
                )}

                {!notifications && permission === 'default' && (
                  <p className="settings-hint">
                    {t('settings.page.notificationsHint')}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

