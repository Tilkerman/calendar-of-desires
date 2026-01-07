import { useState, useEffect } from 'react';
import DesireForm from './components/DesireForm/DesireForm';
import DesireDetail from './components/DesireDetail/DesireDetail';
import type { Desire, LifeArea } from './types';
import { desireService } from './services/db';
import { useI18n } from './i18n';
import LifeWheel from './components/LifeWheel/LifeWheel';
import AreaPickerModal from './components/LifeWheel/AreaPickerModal';
import DesiresList from './components/DesiresList/DesiresList';
import SettingsModal from './components/Settings/SettingsModal';
import AboutPage from './components/Settings/AboutPage';
import TutorialPage from './components/Settings/TutorialPage';
import InstallPage from './components/Settings/InstallPage';
import SettingsPage from './components/Settings/SettingsPage';
import FeedbackPage from './components/Settings/FeedbackPage';
import BackupPage from './components/Settings/BackupPage';
import ClearDataPage from './components/Settings/ClearDataPage';

type View = 'wheel' | 'list' | 'form' | 'detail' | 'about' | 'tutorial' | 'install' | 'settings' | 'feedback' | 'backup' | 'clear';

function App() {
  const { t } = useI18n();
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedDesireId, setSelectedDesireId] = useState<string | null>(null);
  const [editingDesire, setEditingDesire] = useState<Desire | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [presetArea, setPresetArea] = useState<LifeArea | null>(null);
  const [listAreaFilter, setListAreaFilter] = useState<LifeArea | null>(null);
  const [askAreaAfterSave, setAskAreaAfterSave] = useState(false);
  const [pendingAreaForDesireId, setPendingAreaForDesireId] = useState<string | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Проверяем наличие желаний при загрузке
  useEffect(() => {
    const checkDesires = async () => {
      try {
        await desireService.getAllDesires();
        setCurrentView('list');
      } catch (error) {
        console.error('Ошибка при проверке желаний:', error);
        setCurrentView('list');
      } finally {
        setIsLoading(false);
      }
    };

    checkDesires();
  }, []);

  const handleCreateDesire = () => {
    setEditingDesire(undefined);
    setCurrentView('form');
  };

  const handleDesireSaved = (desireId?: string) => {
    setEditingDesire(undefined);
    if (desireId) {
      if (askAreaAfterSave) {
        setPendingAreaForDesireId(desireId);
        setCurrentView('wheel');
      } else {
        setSelectedDesireId(desireId);
        setCurrentView('detail');
      }
    } else {
      setCurrentView('wheel');
      setSelectedDesireId(null);
    }
    setAskAreaAfterSave(false);
    setPresetArea(null);
  };

  const handleBackToWheel = () => {
    setSelectedDesireId(null);
    setCurrentView('wheel');
  };

  const handleSettingsClick = () => {
    console.log('[App] Settings clicked, opening modal');
    setIsSettingsModalOpen(true);
  };

  const handleSettingsMenuItemClick = (menuItem: string) => {
    switch (menuItem) {
      case 'about':
        setCurrentView('about');
        break;
      case 'tutorial':
        setCurrentView('tutorial');
        break;
      case 'install':
        setCurrentView('install');
        break;
      case 'settings':
        setCurrentView('settings');
        break;
      case 'feedback':
        setCurrentView('feedback');
        break;
      case 'backup':
        setCurrentView('backup');
        break;
      case 'clear':
        setCurrentView('clear');
        break;
    }
  };

  const handleBackFromSettings = () => {
    setCurrentView('wheel');
  };

  const handleDataCleared = () => {
    // После очистки данных возвращаемся на главный экран
    setCurrentView('wheel');
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        padding: '2rem'
      }}>
        <div style={{ fontSize: '1rem', textAlign: 'center' }}>{t('common.loading')}</div>
      </div>
    );
  }

  if (currentView === 'wheel') {
    return (
      <>
        <LifeWheel
          onCreateWish={() => {
            setPresetArea(null);
            setAskAreaAfterSave(true);
            handleCreateDesire();
          }}
          onCreateWishInArea={(area) => {
            setPresetArea(area);
            setAskAreaAfterSave(false);
            handleCreateDesire();
          }}
          onShowAllDesires={(area) => {
            setListAreaFilter(area ?? null);
            setCurrentView('list');
          }}
          onSettingsClick={handleSettingsClick}
        />
        <AreaPickerModal
          open={!!pendingAreaForDesireId}
          onClose={() => setPendingAreaForDesireId(null)}
          onPick={async (area) => {
            if (!pendingAreaForDesireId) return;
            await desireService.updateDesire(pendingAreaForDesireId, { area });
            const id = pendingAreaForDesireId;
            setPendingAreaForDesireId(null);
            setSelectedDesireId(id);
            setCurrentView('detail');
          }}
        />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onMenuItemClick={handleSettingsMenuItemClick}
        />
      </>
    );
  }

  if (currentView === 'list') {
    return (
      <>
        <DesiresList
          filterArea={listAreaFilter}
          onBack={() => {
            setListAreaFilter(null);
            setCurrentView('wheel');
          }}
          useAreaBorderColors
          onDesireClick={(desire) => {
            setSelectedDesireId(desire.id);
            setCurrentView('detail');
          }}
          onAddDesire={() => {
            setPresetArea(null);
            setAskAreaAfterSave(true);
            handleCreateDesire();
          }}
          onSettingsClick={handleSettingsClick}
        />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onMenuItemClick={handleSettingsMenuItemClick}
        />
      </>
    );
  }

  if (currentView === 'form') {
    return (
      <>
        <DesireForm 
          onSave={handleDesireSaved} 
          initialDesire={editingDesire}
          presetArea={presetArea}
          onBack={() => setCurrentView('wheel')}
        />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onMenuItemClick={handleSettingsMenuItemClick}
        />
      </>
    );
  }

  if (currentView === 'detail' && selectedDesireId) {
    return (
      <>
        <DesireDetail
          desireId={selectedDesireId}
          onBack={handleBackToWheel}
          onSettingsClick={handleSettingsClick}
        />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onMenuItemClick={handleSettingsMenuItemClick}
        />
      </>
    );
  }

  if (currentView === 'about') {
    return (
      <>
        <AboutPage onBack={handleBackFromSettings} onSettingsClick={handleSettingsClick} />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onMenuItemClick={handleSettingsMenuItemClick}
        />
      </>
    );
  }

  if (currentView === 'tutorial') {
    return (
      <>
        <TutorialPage
          onBack={handleBackFromSettings}
          onCreateDesire={() => {
            setPresetArea(null);
            setAskAreaAfterSave(true);
            handleCreateDesire();
          }}
          onSettingsClick={handleSettingsClick}
        />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onMenuItemClick={handleSettingsMenuItemClick}
        />
      </>
    );
  }

  if (currentView === 'install') {
    return (
      <>
        <InstallPage onBack={handleBackFromSettings} onSettingsClick={handleSettingsClick} />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onMenuItemClick={handleSettingsMenuItemClick}
        />
      </>
    );
  }

  if (currentView === 'settings') {
    return (
      <>
        <SettingsPage onBack={handleBackFromSettings} onSettingsClick={handleSettingsClick} />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onMenuItemClick={handleSettingsMenuItemClick}
        />
      </>
    );
  }

  if (currentView === 'feedback') {
    return (
      <>
        <FeedbackPage onBack={handleBackFromSettings} onSettingsClick={handleSettingsClick} />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onMenuItemClick={handleSettingsMenuItemClick}
        />
      </>
    );
  }

  if (currentView === 'backup') {
    return (
      <>
        <BackupPage onBack={handleBackFromSettings} onSettingsClick={handleSettingsClick} />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onMenuItemClick={handleSettingsMenuItemClick}
        />
      </>
    );
  }

  if (currentView === 'clear') {
    return (
      <>
        <ClearDataPage onBack={handleBackFromSettings} onDataCleared={handleDataCleared} onSettingsClick={handleSettingsClick} />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onMenuItemClick={handleSettingsMenuItemClick}
        />
      </>
    );
  }

  // Fallback - если что-то пошло не так
  return (
    <>
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        padding: '2rem'
      }}>
        <div style={{ fontSize: '1rem', textAlign: 'center' }}>
          {t('app.unknownState')}
        </div>
      </div>
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onMenuItemClick={handleSettingsMenuItemClick}
      />
    </>
  );
}

export default App;
