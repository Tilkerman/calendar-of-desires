import { useState, useEffect } from 'react';
import type { Desire, Contact } from '../../types';
import { desireService, contactService } from '../../services/db';
import ContactIndicators from '../ContactIndicators/ContactIndicators';
import './DesireDetail.css';

interface DesireDetailProps {
  desireId: string;
  onBack: () => void;
}

export default function DesireDetail({ desireId, onBack }: DesireDetailProps) {
  const [desire, setDesire] = useState<Desire | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Контакты за последние 7 дней
  const [entryDays, setEntryDays] = useState(0);
  const [thoughtDays, setThoughtDays] = useState(0);
  const [stepDays, setStepDays] = useState(0);
  
  // Сегодняшние контакты
  const [todayEntry, setTodayEntry] = useState<Contact | null>(null);
  const [entryText, setEntryText] = useState('');
  
  // Состояния для редактирования
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editingDescription, setEditingDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showStepComment, setShowStepComment] = useState(false);
  const [stepComment, setStepComment] = useState('');

  useEffect(() => {
    loadDesire();
  }, [desireId]);

  const loadDesire = async () => {
    setIsLoading(true);
    try {
      const loadedDesire = await desireService.getDesireById(desireId);
      if (!loadedDesire) {
        onBack();
        return;
      }

      setDesire(loadedDesire);
      setEditingDescription(loadedDesire.description);

      // Загружаем контакты за 7 дней
      const entry = await contactService.getContactDaysLast7Days(desireId, 'entry');
      const thought = await contactService.getContactDaysLast7Days(desireId, 'thought');
      const step = await contactService.getContactDaysLast7Days(desireId, 'step');
      
      setEntryDays(entry);
      setThoughtDays(thought);
      setStepDays(step);

      // Загружаем сегодняшнюю запись
      const todayEntryContact = await contactService.getTodayContact(desireId, 'entry');
      if (todayEntryContact) {
        setTodayEntry(todayEntryContact);
        setEntryText(todayEntryContact.text || '');
      } else {
        setTodayEntry(null);
        setEntryText('');
      }
    } catch (error) {
      console.error('Ошибка при загрузке желания:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEntry = async () => {
    if (!desire) return;
    
    setIsSaving(true);
    try {
      await contactService.createOrUpdateContact(desire.id, 'entry', entryText.trim() || null);
      await loadDesire();
    } catch (error) {
      console.error('Ошибка при сохранении записи:', error);
      alert('Не удалось сохранить запись');
    } finally {
      setIsSaving(false);
    }
  };

  const handleThoughtClick = async () => {
    if (!desire) return;
    
    setIsSaving(true);
    try {
      await contactService.createOrUpdateContact(desire.id, 'thought', null);
      await loadDesire();
    } catch (error) {
      console.error('Ошибка при сохранении мыслей:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStepClick = async () => {
    if (!desire) return;
    
    if (!showStepComment) {
      // Показываем поле для комментария
      setShowStepComment(true);
      return;
    }

    // Сохраняем шаг с комментарием
    setIsSaving(true);
    try {
      await contactService.createOrUpdateContact(desire.id, 'step', stepComment.trim() || null);
      setShowStepComment(false);
      setStepComment('');
      await loadDesire();
    } catch (error) {
      console.error('Ошибка при сохранении шага:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDescription = async () => {
    if (!desire) return;
    
    setIsSaving(true);
    try {
      await desireService.updateDesire(desire.id, { description: editingDescription });
      setIsEditingDescription(false);
      await loadDesire();
    } catch (error) {
      console.error('Ошибка при сохранении описания:', error);
      alert('Не удалось сохранить описание');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDesire = async () => {
    if (!desire) return;
    
    const confirmed = window.confirm(`Удалить желание "${desire.title}"? Это действие нельзя отменить.`);
    if (!confirmed) return;

    try {
      await desireService.deleteDesire(desire.id);
      onBack();
    } catch (error) {
      console.error('Ошибка при удалении желания:', error);
      alert('Не удалось удалить желание');
    }
  };

  if (isLoading) {
    return (
      <div className="desire-detail-loading">
        <div>Загрузка...</div>
      </div>
    );
  }

  if (!desire) {
    return null;
  }

  return (
    <div className="desire-detail">
      {/* Шапка экрана желания */}
      <header className="desire-detail-header">
        <button className="desire-detail-back" onClick={onBack} aria-label="Назад">
          ←
        </button>
        <h1 className="desire-detail-title">{desire.title}</h1>
        {desire.isActive && (
          <div className="desire-detail-focus-icon" title="Сегодня в фокусе">
            ✓
          </div>
        )}
      </header>

      {/* Визуальный якорь */}
      {desire.imageUrl && (
        <div className="desire-detail-visual">
          <img src={desire.imageUrl} alt={desire.title} />
        </div>
      )}

      <div className="desire-detail-content">
        {/* Блок "Состояние контакта" */}
        <div className="desire-detail-section">
          <h2 className="desire-detail-section-title">Контакт за 7 дней</h2>
          <ContactIndicators
            entryDays={entryDays}
            thoughtDays={thoughtDays}
            stepDays={stepDays}
            size="large"
          />
        </div>

        {/* Блок записей */}
        <div className="desire-detail-section">
          <h2 className="desire-detail-section-title">Записи</h2>
          <textarea
            className="desire-detail-entry-input"
            value={entryText}
            onChange={(e) => setEntryText(e.target.value)}
            onBlur={handleSaveEntry}
            placeholder="Что ты сейчас думаешь или чувствуешь по поводу этого желания?"
            rows={4}
            disabled={isSaving}
          />
          {entryText !== (todayEntry?.text || '') && (
            <button
              className="desire-detail-save-button"
              onClick={handleSaveEntry}
              disabled={isSaving}
            >
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </button>
          )}
        </div>

        {/* Блок мыслей */}
        <div className="desire-detail-section">
          <h2 className="desire-detail-section-title">Мысли</h2>
          <button
            className="desire-detail-action-button"
            onClick={handleThoughtClick}
            disabled={isSaving}
          >
            Я сегодня возвращался к этому желанию мыслями
          </button>
        </div>

        {/* Блок шагов */}
        <div className="desire-detail-section">
          <h2 className="desire-detail-section-title">Шаги</h2>
          {!showStepComment ? (
            <button
              className="desire-detail-action-button"
              onClick={handleStepClick}
              disabled={isSaving}
            >
              Отметить внешний шаг
            </button>
          ) : (
            <div className="desire-detail-step-comment">
              <textarea
                className="desire-detail-step-input"
                value={stepComment}
                onChange={(e) => setStepComment(e.target.value)}
                placeholder="Что это был за шаг? (необязательно)"
                rows={2}
              />
              <div className="desire-detail-step-actions">
                <button
                  className="desire-detail-save-button"
                  onClick={handleStepClick}
                  disabled={isSaving}
                >
                  Сохранить
                </button>
                <button
                  className="desire-detail-cancel-button"
                  onClick={() => {
                    setShowStepComment(false);
                    setStepComment('');
                  }}
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Эмоциональное описание */}
        <div className="desire-detail-section">
          <h2 className="desire-detail-section-title">Как ты хочешь себя чувствовать?</h2>
          {isEditingDescription ? (
            <div className="desire-detail-description-edit">
              <textarea
                className="desire-detail-description-input"
                value={editingDescription}
                onChange={(e) => setEditingDescription(e.target.value)}
                placeholder="Спокойно, свободно, уверенно…"
                rows={3}
              />
              <div className="desire-detail-description-actions">
                <button
                  className="desire-detail-save-button"
                  onClick={handleSaveDescription}
                  disabled={isSaving}
                >
                  Сохранить
                </button>
                <button
                  className="desire-detail-cancel-button"
                  onClick={() => {
                    setEditingDescription(desire.description);
                    setIsEditingDescription(false);
                  }}
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="desire-detail-description-view">
              <p>{desire.description || 'Не указано'}</p>
              <button
                className="desire-detail-edit-button"
                onClick={() => setIsEditingDescription(true)}
              >
                Изменить
              </button>
            </div>
          )}
        </div>

        {/* Ориентир по времени */}
        {desire.deadline && (
          <div className="desire-detail-section">
            <h2 className="desire-detail-section-title">Ориентир по времени</h2>
            <p className="desire-detail-deadline">
              {new Date(desire.deadline).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="desire-detail-deadline-hint">
              Это не срок и не обязательство
            </p>
          </div>
        )}

        {/* Дополнительные действия */}
        <div className="desire-detail-section">
          <h2 className="desire-detail-section-title">Дополнительно</h2>
          <div className="desire-detail-actions">
            <button
              className="desire-detail-secondary-button"
              onClick={() => {
                // TODO: Редактирование желания
                alert('Редактирование желания (в разработке)');
              }}
            >
              Изменить название
            </button>
            <button
              className="desire-detail-secondary-button"
              onClick={() => {
                // TODO: Изменение изображений
                alert('Изменение изображений (в разработке)');
              }}
            >
              Изменить изображения
            </button>
            <button
              className="desire-detail-delete-button"
              onClick={handleDeleteDesire}
            >
              Удалить желание
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

