import { useState, useRef } from 'react';
import type { Desire } from '../../types';
import { desireService } from '../../services/db';
import './DesireForm.css';

interface DesireFormProps {
  onSave: () => void;
  initialDesire?: Desire;
}

export default function DesireForm({ onSave, initialDesire }: DesireFormProps) {
  const [title, setTitle] = useState(initialDesire?.title || '');
  const [description, setDescription] = useState(initialDesire?.description || '');
  const [deadline, setDeadline] = useState(
    initialDesire?.deadline ? initialDesire.deadline.split('T')[0] : ''
  );
  const [imageUrl, setImageUrl] = useState(initialDesire?.imageUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Пожалуйста, введите название желания');
      return;
    }

    setIsLoading(true);
    try {
      if (initialDesire) {
        await desireService.updateDesire(initialDesire.id, {
          title: title.trim(),
          description: description.trim(),
          deadline: deadline || null,
          imageUrl,
        });
      } else {
        await desireService.createDesire({
          title: title.trim(),
          description: description.trim(),
          deadline: deadline || null,
          imageUrl,
          isActive: false, // Фокус устанавливается при клике на карточку
        });
      }
      onSave();
    } catch (error) {
      console.error('Ошибка при сохранении желания:', error);
      alert('Не удалось сохранить желание');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="desire-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Название желания</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Опишите свое желание..."
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Как ты хочешь себя чувствовать?</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Спокойно, свободно, уверенно…"
          rows={4}
        />
      </div>

      <div className="form-group">
        <label htmlFor="deadline">Ориентир по времени (опционально)</label>
        <input
          id="deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <p className="form-hint">Это не срок и не обязательство</p>
      </div>

      <div className="form-group">
        <label htmlFor="image">Визуальный образ (опционально)</label>
        <input
          ref={fileInputRef}
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        <div className="image-upload">
          {imageUrl ? (
            <div className="image-preview">
              <img src={imageUrl} alt="Preview" />
              <button
                type="button"
                onClick={() => {
                  setImageUrl(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="remove-image"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="upload-button"
            >
              Выбрать изображение
            </button>
          )}
        </div>
      </div>

      <button type="submit" className="submit-button" disabled={isLoading}>
        {isLoading ? 'Сохранение...' : initialDesire ? 'Обновить' : 'Создать желание'}
      </button>
    </form>
  );
}




