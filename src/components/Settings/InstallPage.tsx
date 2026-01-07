import Header from '../Header/Header';
import './SettingsPages.css';
import { useI18n } from '../../i18n';

interface InstallPageProps {
  onBack: () => void;
  onSettingsClick?: () => void;
}

export default function InstallPage({ onBack, onSettingsClick }: InstallPageProps) {
  const { t } = useI18n();

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
          <div className="settings-page-text">
            <p>{t('settings.install.text1')}</p>
            <ul className="settings-page-list">
              <li>{t('settings.install.item1')}</li>
              <li>{t('settings.install.item2')}</li>
            </ul>
            <p>{t('settings.install.text2')}</p>
          </div>
        </div>
      </div>
    </>
  );
}

