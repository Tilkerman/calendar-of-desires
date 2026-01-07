import { useEffect } from 'react';
import './SettingsModal.css';
import { useI18n } from '../../i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuItemClick: (menuItem: string) => void;
}

export default function SettingsModal({ isOpen, onClose, onMenuItemClick }: SettingsModalProps) {
  const { t } = useI18n();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Не возвращаем null, чтобы компонент всегда был в DOM (для отладки)
  if (!isOpen) {
    return null;
  }

  const menuItems = [
    { id: 'about', icon: 'ℹ️', label: t('settings.menu.about') },
    { id: 'tutorial', icon: '📖', label: t('settings.menu.tutorial') },
    { id: 'install', icon: '📱', label: t('settings.menu.install') },
    { id: 'settings', icon: '⚙️', label: t('settings.menu.settings') },
    { id: 'feedback', icon: '✉️', label: t('settings.menu.feedback') },
    { id: 'backup', icon: '💾', label: t('settings.menu.backup') },
    { id: 'clear', icon: '🗑️', label: t('settings.menu.clear') },
    { id: 'share', icon: '↗️', label: t('settings.menu.share') },
  ];

  const handleMenuItemClick = (itemId: string) => {
    if (itemId === 'share') {
      handleShare();
      return;
    }
    onMenuItemClick(itemId);
    onClose();
  };

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

  return (
    <>
      <div className="settings-modal-overlay" onClick={onClose} />
      <div className="settings-modal">
        <div className="settings-modal-header">
          <h2 className="settings-modal-title">{t('settings.menu.title')}</h2>
          <button
            className="settings-modal-close"
            onClick={onClose}
            aria-label={t('common.close')}
            type="button"
          >
            ✕
          </button>
        </div>
        <div className="settings-modal-content">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="settings-menu-item"
              onClick={() => handleMenuItemClick(item.id)}
              type="button"
            >
              <span className="settings-menu-icon">{item.icon}</span>
              <span className="settings-menu-label">{item.label}</span>
              <span className="settings-menu-arrow">›</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

