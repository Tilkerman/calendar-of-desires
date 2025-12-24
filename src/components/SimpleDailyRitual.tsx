import { useState, useEffect } from 'react';
import type { Desire, DailyEntry } from '../types';
import { desireService, entryService } from '../services/db';
import { getDailyQuestion } from '../utils/dailyQuestions';
import { getTodayDateString } from '../utils/date';

export default function SimpleDailyRitual() {
  const [desire, setDesire] = useState<Desire | null>(null);
  const [todayEntry, setTodayEntry] = useState<DailyEntry | null>(null);
  const [question, setQuestion] = useState('');
  const [text, setText] = useState('');
  const [closenessRating, setClosenessRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const activeDesire = await desireService.getActiveDesire();
      if (!activeDesire) {
        setIsLoading(false);
        return;
      }

      setDesire(activeDesire);
      setQuestion(getDailyQuestion());

      try {
        const entry = await entryService.getTodayEntry(activeDesire.id);
        if (entry) {
          setTodayEntry(entry);
          setText(entry.text || '');
          setClosenessRating(entry.closenessRating);
        }
      } catch (entryError) {
        console.error('Ошибка при загрузке записи:', entryError);
        // Продолжаем работу даже если запись не загрузилась
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      // Не устанавливаем desire в null, чтобы не сломать UI
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

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '2rem', background: '#ffffff', color: '#213547' }}>Загрузка...</div>;
  }

  if (!desire) {
    return <div style={{ textAlign: 'center', padding: '2rem', background: '#ffffff', color: '#213547' }}>Сначала создай желание</div>;
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', background: '#ffffff', color: '#213547' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>{desire.title}</h1>
        {desire.description && (
          <p style={{ color: '#666', fontStyle: 'italic', marginTop: '0.5rem' }}>
            {desire.description}
          </p>
        )}
      </div>

      <div
        style={{
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          textAlign: 'center'
        }}
      >
        <p style={{ fontSize: '1.1rem', margin: 0 }}>{question}</p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Напиши что-то или оставь пустым..."
          rows={6}
          style={{
            width: '100%',
            padding: '1rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '1rem',
            fontFamily: 'inherit'
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
          Близость к желанию (опционально)
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input
            type="range"
            min="1"
            max="10"
            value={closenessRating || 5}
            onChange={(e) => setClosenessRating(parseInt(e.target.value))}
            style={{ flex: 1 }}
          />
          <span style={{ minWidth: '50px', textAlign: 'center' }}>
            {closenessRating || '-'}/10
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={handleViewOnly}
          disabled={isSaving}
          style={{
            flex: 1,
            padding: '1rem',
            background: '#f5f5f5',
            color: '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            opacity: isSaving ? 0.6 : 1
          }}
        >
          Просто посмотреть
        </button>
        <button
          onClick={handleSaveEntry}
          disabled={isSaving}
          style={{
            flex: 1,
            padding: '1rem',
            background: '#646cff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            opacity: isSaving ? 0.6 : 1
          }}
        >
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>

      {todayEntry && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#e8f5e9',
            borderRadius: '8px',
            color: '#2e7d32',
            textAlign: 'center'
          }}
        >
          ✓ Запись на сегодня сохранена
        </div>
      )}
    </div>
  );
}

