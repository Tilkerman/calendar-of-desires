import { useState, useEffect } from 'react';
import DesireForm from './components/DesireForm/DesireForm';
import DesireDetail from './components/DesireDetail/DesireDetail';
import type { Desire, LifeArea } from './types';
import { desireService } from './services/db';
import { useI18n } from './i18n';
import LifeWheel from './components/LifeWheel/LifeWheel';
import AreaPickerModal from './components/LifeWheel/AreaPickerModal';
import DesiresList from './components/DesiresList/DesiresList';

type View = 'wheel' | 'list' | 'form' | 'detail';

function App() {
  const { t } = useI18n();
  const [currentView, setCurrentView] = useState<View>('wheel');
  const [selectedDesireId, setSelectedDesireId] = useState<string | null>(null);
  const [editingDesire, setEditingDesire] = useState<Desire | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [presetArea, setPresetArea] = useState<LifeArea | null>(null);
  const [listAreaFilter, setListAreaFilter] = useState<LifeArea | null>(null);
  const [askAreaAfterSave, setAskAreaAfterSave] = useState(false);
  const [pendingAreaForDesireId, setPendingAreaForDesireId] = useState<string | null>(null);

  // Проверяем наличие желаний при загрузке
  useEffect(() => {
    const checkDesires = async () => {
      try {
        await desireService.getAllDesires();
        setCurrentView('wheel');
      } catch (error) {
        console.error('Ошибка при проверке желаний:', error);
        setCurrentView('wheel');
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
      </>
    );
  }

  if (currentView === 'list') {
    return (
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
      />
    );
  }

  if (currentView === 'form') {
    return (
      <DesireForm 
        onSave={handleDesireSaved} 
        initialDesire={editingDesire}
        presetArea={presetArea}
        onBack={() => setCurrentView('wheel')}
      />
    );
  }

  if (currentView === 'detail' && selectedDesireId) {
    return (
      <DesireDetail
        desireId={selectedDesireId}
        onBack={handleBackToWheel}
      />
    );
  }

  // Fallback - если что-то пошло не так
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
      <div style={{ fontSize: '1rem', textAlign: 'center' }}>
        {t('app.unknownState')}
      </div>
    </div>
  );
}

export default App;
