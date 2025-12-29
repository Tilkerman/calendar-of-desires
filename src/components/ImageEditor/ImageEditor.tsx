import { useState, useRef } from 'react';
import type { DesireImage } from '../../types';
import './ImageEditor.css';
import { useI18n } from '../../i18n';

interface ImageEditorProps {
  images: DesireImage[];
  onSave: (images: DesireImage[]) => void;
  onCancel: () => void;
  maxImages?: number;
}

export default function ImageEditor({ images, onSave, onCancel, maxImages = 6 }: ImageEditorProps) {
  const { t } = useI18n();
  const [currentImages, setCurrentImages] = useState<DesireImage[]>(images || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (currentImages.length >= maxImages) {
      alert(t('editor.maxAlert', { max: maxImages }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newImage: DesireImage = {
        id: crypto.randomUUID(),
        url: reader.result as string,
        order: currentImages.length,
      };
      setCurrentImages([...currentImages, newImage]);
    };
    reader.readAsDataURL(file);

    // Сбрасываем input для возможности повторного выбора того же файла
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (imageId: string) => {
    const updated = currentImages
      .filter((img) => img.id !== imageId)
      .map((img, index) => ({ ...img, order: index }));
    setCurrentImages(updated);
  };

  const handleReplaceImage = (imageId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = currentImages.map((img) =>
          img.id === imageId ? { ...img, url: reader.result as string } : img
        );
        setCurrentImages(updated);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleSave = () => {
    onSave(currentImages);
  };

  const canAddMore = currentImages.length < maxImages;

  return (
    <div className="image-editor">
      <div className="image-editor-header">
        <h2>{t('editor.title')}</h2>
        <button className="image-editor-close" onClick={onCancel} aria-label={t('common.close')}>
          ×
        </button>
      </div>

      <div className="image-editor-content">
        <div className="image-editor-grid">
          {currentImages.map((image) => (
            <div key={image.id} className="image-editor-item">
              <img src={image.url} alt={t('editor.imageAlt', { n: image.order + 1 })} />
              <div className="image-editor-item-actions">
                <button
                  className="image-editor-action-btn"
                  onClick={() => handleReplaceImage(image.id)}
                  title={t('editor.replace')}
                >
                  🔄
                </button>
                <button
                  className="image-editor-action-btn image-editor-action-btn-danger"
                  onClick={() => handleRemoveImage(image.id)}
                  title={t('editor.remove')}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          {canAddMore && (
            <button className="image-editor-add-btn" onClick={handleAddImage}>
              <span className="image-editor-add-icon">+</span>
              <span className="image-editor-add-text">{t('editor.add')}</span>
            </button>
          )}
        </div>

        <div className="image-editor-info">
          {currentImages.length > 0 && (
            <p className="image-editor-count">
              {t('editor.count', { count: currentImages.length, max: maxImages })}
            </p>
          )}
          {!canAddMore && (
            <p className="image-editor-limit">{t('editor.limit')}</p>
          )}
        </div>
      </div>

      <div className="image-editor-footer">
        <button className="desire-detail-save-button" onClick={handleSave}>
          {t('common.save')}
        </button>
        <button className="desire-detail-cancel-button" onClick={onCancel}>
          {t('common.cancel')}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
}

