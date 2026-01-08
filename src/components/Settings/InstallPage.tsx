import { useState } from 'react';
import Header from '../Header/Header';
import './SettingsPages.css';
import { useI18n } from '../../i18n';
import { db } from '../../services/db';

interface InstallPageProps {
  onBack: () => void;
  onSettingsClick?: () => void;
  onDataCleared?: () => void;
}

export default function InstallPage({ onBack, onSettingsClick, onDataCleared }: InstallPageProps) {
  const { t } = useI18n();
  const [isClearing, setIsClearing] = useState(false);

  const handleShare = async () => {
    const url = window.location.origin + window.location.pathname;
    const title = t('header.appName');
    const text = t('settings.share.text');

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        // Пользователь отменил или ошибка
        console.log('Share cancelled');
      }
    } else {
      // Fallback: копируем в буфер
      try {
        await navigator.clipboard.writeText(url);
        alert(t('settings.share.copied'));
      } catch (err) {
        // Старый браузер
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert(t('settings.share.copied'));
      }
    }
  };

  const handleClear = async () => {
    const confirmed = window.confirm(t('settings.clear.confirm'));
    if (!confirmed) return;

    setIsClearing(true);
    try {
      // Очищаем все таблицы
      await db.desires.clear();
      await db.contacts.clear();
      await db.lifeAreas.clear();
      await db.feedbacks.clear();

      alert(t('settings.clear.success'));
      if (onDataCleared) {
        onDataCleared();
      }
    } catch (error) {
      console.error('Clear data error:', error);
      alert('Ошибка при очистке данных');
    } finally {
      setIsClearing(false);
    }
  };

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
          <h1 className="settings-page-title">{t('settings.install.title')}</h1>

          {/* Секция: Установка приложения */}
          <div className="settings-section" style={{ marginTop: '2rem' }}>
            <h2 className="settings-section-title">{t('settings.install.title')}</h2>
            <div className="settings-page-text">
              <p>{t('settings.install.text1')}</p>
              <ul className="settings-page-list">
                <li>{t('settings.install.item1')}</li>
                <li>{t('settings.install.item2')}</li>
              </ul>
              <p>{t('settings.install.text2')}</p>
            </div>
          </div>

          {/* Секция: Поделиться приложением */}
          <div className="settings-section" style={{ marginTop: '2rem' }}>
            <h2 className="settings-section-title">{t('settings.menu.share')}</h2>
            <div className="settings-page-text">
              <p>{t('settings.share.text')}</p>
            </div>
            <button
              type="button"
              className="backup-button"
              onClick={handleShare}
              style={{ marginTop: '1rem' }}
            >
              {t('settings.menu.share')}
            </button>
          </div>

          {/* Секция: Очистить все данные */}
          <div className="settings-section" style={{ marginTop: '2rem' }}>
            <h2 className="settings-section-title">{t('settings.clear.title')}</h2>
            <div className="settings-page-text">
              <p>{t('settings.clear.confirm')}</p>
            </div>
            <button
              type="button"
              className="backup-button"
              onClick={handleClear}
              disabled={isClearing}
              style={{ background: '#c44d58', marginTop: '1rem' }}
            >
              {isClearing ? t('common.saving') : t('common.delete')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

