import { useState } from 'react';
import { desireService } from '../services/db';

interface DesireFormProps {
  onSave: () => void;
}

export default function DesireForm({ onSave }: DesireFormProps) {
  console.log('DesireForm rendering!');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Пожалуйста, введите название желания');
      return;
    }

    setIsLoading(true);
    try {
      await desireService.createDesire({
        title: title.trim(),
        description: description.trim(),
        deadline: null,
        imageUrl: null,
        isActive: true,
      });
      onSave();
    } catch (error) {
      console.error('Ошибка при сохранении желания:', error);
      alert('Не удалось сохранить желание. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#213547' }}>
        Создай свое желание
      </h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#333' }}>
            Название желания *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Опишите свое желание..."
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#333' }}>
            Зачем это тебе? (опционально)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Опиши, как ты хочешь себя чувствовать, какое состояние хочешь проживать..."
            rows={4}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '1rem',
            background: isLoading ? '#ccc' : '#646cff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {isLoading ? 'Сохранение...' : 'Создать желание'}
        </button>
      </form>
    </div>
  );
}

