import { useState, useEffect } from 'react';
import type { Desire, DailyEntry } from '../../types';
import { desireService, entryService } from '../../services/db';
import { getDailyQuestion } from '../../utils/dailyQuestions';
import { getTodayDateString } from '../../utils/date';
import DesireForm from '../DesireForm/DesireForm';
import './DailyRitual.css';

export default function DailyRitual() {
  const [desire, setDesire] = useState<Desire | null>(null);
  const [todayEntry, setTodayEntry] = useState<DailyEntry | null>(null);
  const [question, setQuestion] = useState<string>('');
  const [text, setText] = useState('');
  const [closenessRating, setClosenessRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const activeDesire = await desireService.getActiveDesire();
      
      if (!activeDesire) {
        setShowForm(true);
        setIsLoading(false);
        return;
      }

      setDesire(activeDesire);
      setQuestion(getDailyQuestion());

      const entry = await entryService.getTodayEntry(activeDesire.id);
      if (entry) {
        setTodayEntry(entry);
        setText(entry.text || '');
        setClosenessRating(entry.closenessRating);
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      // Показываем форму создания желания при ошибке
      setShowForm(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEntry = async () => {
    if (!desire) return;

    setIsSaving(true);
    try {
      const entryData = {
        desireId: desire.id,
        date: getTodayDateString(),
        type: 'full' as const,
        text: text.trim() || null,
        closenessRating,
      };

      if (todayEntry) {
        await entryService.updateEntry(todayEntry.id, entryData);
      } else {
        await entryService.createEntry(entryData);
      }

      await loadData();
    } catch (error) {
      console.error('Ошибка при сохранении записи:', error);
      alert('Не удалось сохранить запись');
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewOnly = async () => {
    if (!desire) return;

    setIsSaving(true);
    try {
      const entryData = {
        desireId: desire.id,
        date: getTodayDateString(),
        type: 'view' as const,
        text: null,
        closenessRating: null,
      };

      if (todayEntry) {
        await entryService.updateEntry(todayEntry.id, entryData);
      } else {
        await entryService.createEntry(entryData);
      }

      await loadData();
    } catch (error) {
      console.error('Ошибка при сохранении момента присутствия:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDesireSaved = () => {
    setShowForm(false);
    loadData();
  };

  if (isLoading) {
    return (
      <div className="loading" style={{ padding: '2rem', textAlign: 'center', background: '#fff', color: '#333' }}>
        Загрузка...
      </div>
    );
  }

  if (showForm || !desire) {
    return (
      <div className="daily-ritual">
        <h2>Создай свое желание</h2>
        <DesireForm onSave={handleDesireSaved} />
      </div>
    );
  }

  return (
    <div className="daily-ritual">
      {desire.imageUrl && (
        <div className="desire-visual">
          <img src={desire.imageUrl} alt={desire.title} />
        </div>
      )}

      <div className="desire-header">
        <h1>{desire.title}</h1>
        {desire.description && <p className="desire-description">{desire.description}</p>}
      </div>

      <div className="ritual-question">
        <p>{question}</p>
      </div>

      <div className="ritual-form">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Напиши что-то или оставь пустым..."
          rows={6}
          className="ritual-textarea"
        />

        <div className="closeness-rating">
          <label>Близость к желанию (опционально)</label>
          <div className="rating-slider">
            <input
              type="range"
              min="1"
              max="10"
              value={closenessRating || 5}
              onChange={(e) => setClosenessRating(parseInt(e.target.value))}
            />
            <span className="rating-value">{closenessRating || '-'}/10</span>
          </div>
        </div>

        <div className="ritual-actions">
          <button
            onClick={handleViewOnly}
            disabled={isSaving}
            className="view-button"
          >
            Просто посмотреть
          </button>
          <button
            onClick={handleSaveEntry}
            disabled={isSaving}
            className="save-button"
          >
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>

      {todayEntry && (
        <div className="today-entry-note">
          <p>✓ Запись на сегодня сохранена</p>
        </div>
      )}
    </div>
  );
}

