import { useState, useEffect } from 'react';
import type { Desire, DailyEntry } from '../../types';
import { desireService, entryService } from '../../services/db';
import { formatDate } from '../../utils/date';
import { exportToText, downloadTextFile } from '../../utils/export';
import './HistoryTimeline.css';

export default function HistoryTimeline() {
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

  if (isLoading) {
    return <div className="loading">Загрузка истории...</div>;
  }

  if (!desire) {
    return (
      <div className="no-desire">
        <p>Сначала создай желание</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="no-entries">
        <h2>История пути</h2>
        <p>Записей пока нет. Начни свой путь с ежедневного ритуала.</p>
      </div>
    );
  }

  const handleExport = () => {
    if (!desire) return;
    const text = exportToText(desire, entries);
    const filename = `calendar-of-desires-${new Date().toISOString().split('T')[0]}.txt`;
    downloadTextFile(text, filename);
  };

  return (
    <div className="history-timeline">
      <div className="history-header">
        <h2>История пути</h2>
        <button onClick={handleExport} className="export-button">
          Экспортировать путь
        </button>
      </div>
      <div className="timeline">
        {entries.map((entry) => (
          <div key={entry.id} className="timeline-entry">
            <div className="entry-date">{formatDate(entry.date)}</div>
            <div className="entry-content">
              {entry.type === 'view' ? (
                <div className="view-entry">
                  <span className="view-icon">👁</span>
                  <span>Момент присутствия</span>
                </div>
              ) : (
                <>
                  {entry.text && (
                    <div className="entry-text">{entry.text}</div>
                  )}
                  {entry.closenessRating !== null && (
                    <div className="entry-rating">
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

