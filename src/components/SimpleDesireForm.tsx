import { useState } from 'react';
import { desireService } from '../services/db';

interface SimpleDesireFormProps {
  onSave: () => void;
}

export default function SimpleDesireForm({ onSave }: SimpleDesireFormProps) {
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
      alert('Не удалось сохранить желание');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', background: '#ffffff', color: '#213547' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Название желания
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
            borderRadius: '4px',
            fontSize: '1rem'
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Зачем это тебе? (опционально)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Опиши, как ты хочешь себя чувствовать..."
          rows={4}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem',
            fontFamily: 'inherit'
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
          borderRadius: '4px',
          fontSize: '1rem',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Сохранение...' : 'Создать желание'}
      </button>
    </form>
  );
}

