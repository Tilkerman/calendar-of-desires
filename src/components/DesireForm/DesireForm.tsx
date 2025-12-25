import { useState, useRef } from 'react';
import type { Desire, DesireImage } from '../../types';
import { desireService } from '../../services/db';
import './DesireForm.css';

interface DesireFormProps {
  onSave: (desireId?: string) => void;
  initialDesire?: Desire;
  onBack?: () => void;
}

export default function DesireForm({ onSave, initialDesire, onBack }: DesireFormProps) {
  const [title, setTitle] = useState(initialDesire?.title || '');
  const [details, setDetails] = useState(initialDesire?.details || '');
  const [description, setDescription] = useState(initialDesire?.description || '');
  const [images, setImages] = useState<DesireImage[]>(initialDesire?.images || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (images.length >= 6) {
      alert('Максимум 6 изображений');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newImage: DesireImage = {
        id: crypto.randomUUID(),
        url: reader.result as string,
        order: images.length,
      };
      setImages([...images, newImage]);
    };
    reader.readAsDataURL(file);

    // Сбрасываем input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (imageId: string) => {
    const updated = images
      .filter((img) => img.id !== imageId)
      .map((img, index) => ({ ...img, order: index }));
    setImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setIsLoading(true);
    try {
      if (initialDesire) {
        await desireService.updateDesire(initialDesire.id, {
          title: title.trim() || '',
          details: details.trim() || null,
          description: description.trim() || '',
          images: images.length > 0 ? images : undefined,
        });
        onSave();
      } else {
        // Создание нового желания
        const desireId = await desireService.createDesire({
          title: title.trim() || '',
          details: details.trim() || null,
          description: description.trim() || '',
          deadline: null,
          images: images.length > 0 ? images : undefined,
          isActive: true, // Новое желание автоматически становится "Сегодня в фокусе"
        });
        // Устанавливаем фокус на новое желание
        await desireService.setFocusDesire(desireId);
        onSave(desireId);
      }
    } catch (error) {
      console.error('Ошибка при сохранении желания:', error);
      setError('Не удалось сохранить желание. Попробуйте ещё раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="desire-form-container">
      {/* Шапка экрана (sticky) */}
      <header className="desire-form-header">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="desire-form-back-button"
            aria-label="Назад"
          >
            <span className="back-arrow">←</span>
            <span className="back-text">Назад</span>
          </button>
        )}
        {!initialDesire && (
          <h1 className="desire-form-header-title">Новое желание</h1>
        )}
        {initialDesire && (
          <h1 className="desire-form-header-title">Изменить желание</h1>
        )}
      </header>
      
      <form className="desire-form" onSubmit={handleSubmit}>
        {error && (
          <div className="desire-form-error">
            {error}
          </div>
        )}

        {/* 1. Название желания */}
        <div className="form-group">
          <label htmlFor="title">Название желания</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError(null);
            }}
            placeholder="Опишите своё желание..."
          />
        </div>

        {/* 2. Описание желания (НОВОЕ ПОЛЕ) */}
        <div className="form-group">
          <label htmlFor="details">Опиши своё желание</label>
          <p className="form-label-hint">Чем подробнее образ, тем легче к нему возвращаться</p>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Как это выглядит?
Где ты?
Что вокруг тебя?
Кто рядом?
Что ты делаешь?"
            rows={8}
          />
          <p className="form-hint">Можно писать не идеально. Это только для тебя.</p>
        </div>

        {/* 3. Эмоциональное состояние */}
        <div className="form-group">
          <label htmlFor="description">Как ты хочешь себя чувствовать?</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Спокойно, свободно, уверенно..."
            rows={4}
          />
        </div>

        {/* 4. Визуальный образ (опционально, до 6 изображений) */}
        <div className="form-group">
          <label htmlFor="image">Визуальный образ (опционально)</label>
          <input
            ref={fileInputRef}
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            disabled={images.length >= 6}
          />
          <div className="image-upload-grid">
            {images.map((image) => (
              <div key={image.id} className="image-preview-item">
                <img src={image.url} alt={`Preview ${image.order + 1}`} />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image.id)}
                  className="remove-image"
                  title="Удалить"
                >
                  ✕
                </button>
              </div>
            ))}
            {images.length < 6 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="upload-button-grid"
                title="Добавить изображение"
              >
                +
              </button>
            )}
          </div>
          {images.length > 0 && (
            <p className="form-hint">{images.length} из 6 изображений</p>
          )}
        </div>

        {/* Кнопка действия */}
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Сохранение...' : initialDesire ? 'Сохранить изменения' : 'Создать желание'}
        </button>
      </form>
    </div>
  );
}




