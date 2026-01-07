import { useState } from 'react';
import Header from '../Header/Header';
import WelcomeScreen from '../WelcomeScreen/WelcomeScreen';
import './SettingsPages.css';
import { useI18n } from '../../i18n';

interface TutorialPageProps {
  onBack: () => void;
  onCreateDesire: () => void;
  onSettingsClick?: () => void;
}

export default function TutorialPage({ onBack, onCreateDesire, onSettingsClick }: TutorialPageProps) {
  const { t } = useI18n();
  const [showWelcome, setShowWelcome] = useState(true);

  if (showWelcome) {
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
          <WelcomeScreen onCreateDesire={() => {
            setShowWelcome(false);
            onCreateDesire();
          }} />
          <div className="tutorial-close-container">
            <button
              type="button"
              className="tutorial-close-button"
              onClick={onBack}
            >
              {t('settings.tutorial.close')}
            </button>
          </div>
        </div>
      </>
    );
  }

  return null;
}

