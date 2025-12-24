import { useState, useEffect } from 'react';
import DesireForm from './components/DesireForm/DesireForm';
import WelcomeScreen from './components/WelcomeScreen/WelcomeScreen';
import DesiresList from './components/DesiresList/DesiresList';
import DesireDetail from './components/DesireDetail/DesireDetail';
import type { Desire } from './types';
import { desireService } from './services/db';

type View = 'welcome' | 'list' | 'form' | 'detail';

function App() {
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [selectedDesireId, setSelectedDesireId] = useState<string | null>(null);
  const [editingDesire, setEditingDesire] = useState<Desire | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем наличие желаний при загрузке
  useEffect(() => {
    const checkDesires = async () => {
      try {
        const desires = await desireService.getAllDesires();
        setCurrentView(desires.length > 0 ? 'list' : 'welcome');
      } catch (error) {
        console.error('Ошибка при проверке желаний:', error);
        setCurrentView('welcome');
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

  const handleDesireSaved = () => {
    setCurrentView('list');
    setEditingDesire(undefined);
  };

  const handleDesireClick = (desire: Desire) => {
    setSelectedDesireId(desire.id);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setSelectedDesireId(null);
    setCurrentView('list');
  };

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}>
        <div>Загрузка...</div>
      </div>
    );
  }

  if (currentView === 'welcome') {
    return <WelcomeScreen onCreateDesire={handleCreateDesire} />;
  }

  if (currentView === 'list') {
    return (
      <DesiresList
        onDesireClick={handleDesireClick}
        onAddDesire={handleCreateDesire}
      />
    );
  }

  if (currentView === 'form') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <button
            onClick={() => setCurrentView('list')}
            style={{
              marginBottom: '1rem',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              padding: '0.5rem',
              borderRadius: '0.5rem',
            }}
            aria-label="Назад"
          >
            ←
          </button>
          <DesireForm onSave={handleDesireSaved} initialDesire={editingDesire} />
        </div>
      </div>
    );
  }

  if (currentView === 'detail' && selectedDesireId) {
    return (
      <DesireDetail
        desireId={selectedDesireId}
        onBack={handleBackToList}
      />
    );
  }

  return null;
}

export default App;
