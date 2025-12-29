import { useState, useRef } from 'react';
import type { Desire, DesireImage } from '../../types';
import { desireService } from '../../services/db';
import './DesireForm.css';
import { useI18n } from '../../i18n';
import HeaderActions from '../Header/HeaderActions';

interface DesireFormProps {
  onSave: (desireId?: string) => void;
  initialDesire?: Desire;
  onBack?: () => void;
}

export default function DesireForm({ onSave, initialDesire, onBack }: DesireFormProps) {
  const { t } = useI18n();
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
      alert(t('form.visual.max'));
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
      setError(t('form.error.save'));
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
            aria-label={t('common.back')}
          >
            <span className="back-arrow">←</span>
            <span className="back-text">{t('common.back')}</span>
          </button>
        )}
        {!initialDesire && (
          <h1 className="desire-form-header-title">{t('form.newTitle')}</h1>
        )}
        {initialDesire && (
          <h1 className="desire-form-header-title">{t('form.editTitle')}</h1>
        )}
        <HeaderActions />
      </header>
      
      <form className="desire-form" onSubmit={handleSubmit}>
        {error && (
          <div className="desire-form-error">
            {error}
          </div>
        )}

        {/* 1. Название желания */}
        <div className="form-group">
          <label htmlFor="title">{t('form.title.label')}</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError(null);
            }}
            placeholder={t('form.title.placeholder')}
          />
        </div>

        {/* 2. Описание желания (НОВОЕ ПОЛЕ) */}
        <div className="form-group">
          <label htmlFor="details">{t('form.details.label')}</label>
          <p className="form-label-hint">{t('form.details.hint')}</p>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder={t('form.details.placeholder')}
            rows={8}
          />
          <p className="form-hint">{t('form.details.footerHint')}</p>
        </div>

        {/* 3. Эмоциональное состояние */}
        <div className="form-group">
          <label htmlFor="description">{t('form.feelings.label')}</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('form.feelings.placeholder')}
            rows={4}
          />
        </div>

        {/* 4. Визуальный образ (опционально, до 6 изображений) */}
        <div className="form-group">
          <label htmlFor="image">{t('form.visual.label')}</label>
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
                <img src={image.url} alt={t('form.image.previewAlt', { n: image.order + 1 })} />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image.id)}
                  className="remove-image"
                  title={t('form.image.removeTitle')}
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
                title={t('form.image.addTitle')}
              >
                +
              </button>
            )}
          </div>
          {images.length > 0 && (
            <p className="form-hint">{t('form.visual.count', { count: images.length })}</p>
          )}
        </div>

        {/* Кнопка действия */}
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading
            ? t('form.submit.saving')
            : initialDesire
              ? t('form.submit.save')
              : t('form.submit.create')}
        </button>
      </form>
    </div>
  );
}




