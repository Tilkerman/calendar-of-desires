import { useState, useEffect } from 'react';
import type { Desire, DailyEntry } from '../types';
import { desireService, entryService } from '../services/db';
import { formatDate } from '../utils/date';
import { exportToText, downloadTextFile } from '../utils/export';

export default function SimpleHistoryTimeline() {
  const [desire, setDesire] = useState<Desire | null>(null);
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const activeDesire = await desireService.getActiveDesire();
      if (activeDesire) {
        setDesire(activeDesire);
        const history = await entryService.getAllEntries(activeDesire.id);
        setEntries(history);
      }
    } catch (error) {
      console.error('Ошибка при загрузке истории:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!desire) return;
    const text = exportToText(desire, entries);
    const filename = `calendar-of-desires-${new Date().toISOString().split('T')[0]}.txt`;
    downloadTextFile(text, filename);
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '2rem', background: '#ffffff', color: '#213547' }}>Загрузка истории...</div>;
  }

  if (!desire) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', background: '#ffffff', color: '#213547' }}>
        <p>Сначала создай желание</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', background: '#ffffff', color: '#213547' }}>
        <h2>История пути</h2>
        <p style={{ color: '#666', marginTop: '1rem' }}>
          Записей пока нет. Начни свой путь с ежедневного ритуала.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', background: '#ffffff', color: '#213547' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>История пути</h2>
        <button
          onClick={handleExport}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#646cff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Экспортировать путь
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {entries.map((entry) => (
          <div
            key={entry.id}
            style={{
              background: '#f8f9fa',
              borderRadius: '8px',
              padding: '1.5rem',
              borderLeft: '4px solid #646cff'
            }}
          >
            <div style={{ fontWeight: 600, color: '#646cff', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
              {formatDate(entry.date)}
            </div>
            <div>
              {entry.type === 'view' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontStyle: 'italic' }}>
                  <span>👁</span>
                  <span>Момент присутствия</span>
                </div>
              ) : (
                <>
                  {entry.text && (
                    <div style={{ lineHeight: 1.6, marginBottom: '0.5rem', whiteSpace: 'pre-wrap' }}>
                      {entry.text}
                    </div>
                  )}
                  {entry.closenessRating !== null && (
                    <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                      Близость: {entry.closenessRating}/10
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

