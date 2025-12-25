import { useState, useEffect } from 'react';
import type { Desire, Contact, DesireImage } from '../../types';
import { desireService, contactService } from '../../services/db';
import ContactIndicators from '../ContactIndicators/ContactIndicators';
import ImageGallery from '../ImageGallery/ImageGallery';
import ImageEditor from '../ImageEditor/ImageEditor';
import { formatDate, getTodayDateString } from '../../utils/date';
import './DesireDetail.css';

interface DesireDetailProps {
  desireId: string;
  onBack: () => void;
}

export default function DesireDetail({ desireId, onBack }: DesireDetailProps) {
  const [desire, setDesire] = useState<Desire | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Контакты за последние 7 дней (общее количество дней с любым контактом)
  const [contactDays, setContactDays] = useState(0);
  
  // Сегодняшние контакты
  const [todayEntry, setTodayEntry] = useState<Contact | null>(null);
  const [todayThought, setTodayThought] = useState<Contact | null>(null);
  const [todayStep, setTodayStep] = useState<Contact | null>(null);
  const [entryText, setEntryText] = useState('');
  const [stepText, setStepText] = useState('');
  
  // История контактов (все, но без сегодняшних)
  const [entryHistory, setEntryHistory] = useState<Contact[]>([]);
  const [thoughtHistory, setThoughtHistory] = useState<Contact[]>([]);
  const [stepHistory, setStepHistory] = useState<Contact[]>([]);
  
  // Состояния для модальных окон истории
  const [showEntryHistory, setShowEntryHistory] = useState(false);
  const [showStepHistory, setShowStepHistory] = useState(false);
  
  // Состояния для редактирования
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editingDescription, setEditingDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveConfirmation, setSaveConfirmation] = useState<string | null>(null);
  
  // Состояния для модальных окон редактирования
  const [showEditTitleModal, setShowEditTitleModal] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);
  const [editingDetails, setEditingDetails] = useState('');
  const [showEditImagesModal, setShowEditImagesModal] = useState(false);

  useEffect(() => {
    loadDesire();
  }, [desireId]);

  // Обновляем данные при возврате на экран (например, после создания контакта)
  useEffect(() => {
    const handleFocus = () => {
      loadDesire();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
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

      // Загружаем общее количество дней с контактом за 7 дней
      const totalContactDays = await contactService.getTotalContactDaysLast7Days(desireId);
      setContactDays(totalContactDays);

      // Загружаем сегодняшние контакты
      const todayEntryContact = await contactService.getTodayContact(desireId, 'entry');
      const todayThoughtContact = await contactService.getTodayContact(desireId, 'thought');
      const todayStepContact = await contactService.getTodayContact(desireId, 'step');
      
      if (todayEntryContact) {
        setTodayEntry(todayEntryContact);
        setEntryText(todayEntryContact.text || '');
      } else {
        setTodayEntry(null);
        setEntryText('');
      }
      
      if (todayStepContact) {
        setTodayStep(todayStepContact);
        setStepText(todayStepContact.text || '');
      } else {
        setTodayStep(null);
        setStepText('');
      }
      
      setTodayThought(todayThoughtContact || null);

      // Загружаем историю контактов (все для каждого типа, исключая сегодняшние)
      const today = getTodayDateString();
      const entryContacts = await contactService.getContactsByType(desireId, 'entry');
      const thoughtContacts = await contactService.getContactsByType(desireId, 'thought');
      const stepContacts = await contactService.getContactsByType(desireId, 'step');
      
      // Исключаем сегодняшние записи из истории
      setEntryHistory(entryContacts.filter(c => c.date !== today));
      setThoughtHistory(thoughtContacts.filter(c => c.date !== today));
      setStepHistory(stepContacts.filter(c => c.date !== today));
    } catch (error) {
      console.error('Ошибка при загрузке желания:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Унифицированная функция сохранения для Записей и Шагов
  const handleSaveNoteOrStep = async (type: 'entry' | 'step', text: string) => {
    if (!desire) return;
    
    setIsSaving(true);
    try {
      const textToSave = text.trim();
      
      // Если текст пустой и был сохранён контакт ранее - удаляем контакт
      // Если текст есть - создаём/обновляем контакт
      const todayContact = type === 'entry' ? todayEntry : todayStep;
      
      if (!textToSave && todayContact) {
        // Удаляем контакт, если текст пустой
        await contactService.deleteContact(todayContact.id);
        setSaveConfirmation(type);
        setTimeout(() => setSaveConfirmation(null), 2000);
      } else if (textToSave) {
        // Создаём/обновляем контакт только если есть текст
        await contactService.createOrUpdateContact(desire.id, type, textToSave);
        setSaveConfirmation(type);
        setTimeout(() => setSaveConfirmation(null), 2000);
      }
      
      await loadDesire();
    } catch (error) {
      console.error(`Ошибка при сохранении ${type === 'entry' ? 'записи' : 'шага'}:`, error);
      alert(`Не удалось сохранить ${type === 'entry' ? 'запись' : 'шаг'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEntry = async () => {
    await handleSaveNoteOrStep('entry', entryText);
  };

  const handleSaveStep = async () => {
    await handleSaveNoteOrStep('step', stepText);
  };

  const handleThoughtClick = async () => {
    if (!desire || todayThought) return; // Уже есть контакт за сегодня
    
    setIsSaving(true);
    try {
      await contactService.createOrUpdateContact(desire.id, 'thought', null);
      setSaveConfirmation('thought');
      setTimeout(() => setSaveConfirmation(null), 2000);
      await loadDesire();
    } catch (error) {
      console.error('Ошибка при сохранении мыслей:', error);
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

  const handleEditTitle = () => {
    if (!desire) return;
    setEditingTitle(desire.title);
    setShowEditTitleModal(true);
  };

  const handleSaveTitle = async () => {
    if (!desire || !editingTitle.trim()) return;
    
    setIsSaving(true);
    try {
      await desireService.updateDesire(desire.id, { title: editingTitle.trim() });
      setShowEditTitleModal(false);
      await loadDesire();
    } catch (error) {
      console.error('Ошибка при сохранении названия:', error);
      alert('Не удалось сохранить название');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditDetails = () => {
    if (!desire) return;
    setEditingDetails(desire.details || '');
    setShowEditDetailsModal(true);
  };

  const handleSaveDetails = async () => {
    if (!desire) return;
    
    setIsSaving(true);
    try {
      await desireService.updateDesire(desire.id, { details: editingDetails.trim() || null });
      setShowEditDetailsModal(false);
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
          <span className="back-arrow">←</span>
          <span className="back-text">Назад</span>
        </button>
        <h1 className="desire-detail-title">{desire.title}</h1>
        {desire.isActive && (
          <div className="desire-detail-focus-icon" title="Сегодня в фокусе">
            ✓
          </div>
        )}
      </header>

      {/* Визуальный якорь - галерея изображений */}
      {(() => {
        // Получаем изображения: сначала из массива images, затем из imageUrl (legacy)
        const images: DesireImage[] = desire.images || [];
        const hasLegacyImage = desire.imageUrl && images.length === 0;
        
        // Если есть legacy imageUrl, добавляем его как первое изображение
        if (hasLegacyImage && desire.imageUrl) {
          images.push({
            id: 'legacy-' + desire.id,
            url: desire.imageUrl,
            order: 0,
          });
        }

        if (images.length === 0) {
          return (
            <div className="desire-detail-visual">
              <div className="desire-detail-visual-placeholder"></div>
            </div>
          );
        }

        return <ImageGallery images={images} title={desire.title} />;
      })()}

      <div className="desire-detail-content">
        {/* Блок "Состояние контакта" */}
        <div className="desire-detail-section">
          <h2 className="desire-detail-section-title">Контакт за 7 дней</h2>
          <ContactIndicators
            contactDays={contactDays}
            size="large"
          />
          <p className="desire-detail-contact-hint">
            Это отражение того, как часто ты возвращался к этому желанию за последние 7 дней
          </p>
        </div>

        {/* Блок записей */}
        <div className="desire-detail-section">
          <div className="desire-detail-section-header">
            <h2 className="desire-detail-section-title">Записи</h2>
            <button
              className="desire-detail-history-button-small"
              onClick={() => setShowEntryHistory(true)}
              title="История записей"
            >
              История записей
            </button>
          </div>
          <textarea
            className="desire-detail-entry-input"
            value={entryText}
            onChange={(e) => setEntryText(e.target.value)}
            onBlur={handleSaveEntry}
            placeholder="Что ты сейчас думаешь или чувствуешь по поводу этого желания?"
            rows={4}
            disabled={isSaving}
          />
          {entryText.trim() !== (todayEntry?.text || '').trim() && entryText.trim() && (
            <button
              className="desire-detail-save-button"
              onClick={handleSaveEntry}
              disabled={isSaving}
            >
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </button>
          )}
          {saveConfirmation === 'entry' && (
            <div className="desire-detail-confirmation">✓ Сохранено</div>
          )}
        </div>

        {/* Блок мыслей */}
        <div className="desire-detail-section">
          <h2 className="desire-detail-section-title desire-detail-section-title-spaced">Мысли</h2>
          <button
            className={`desire-detail-action-button ${todayThought ? 'desire-detail-action-button-done' : ''}`}
            onClick={handleThoughtClick}
            disabled={isSaving || !!todayThought}
          >
            {todayThought ? '✓ Уже отмечено сегодня' : 'Я сегодня возвращался к этому желанию мыслями'}
          </button>
          {saveConfirmation === 'thought' && (
            <div className="desire-detail-confirmation">✓ Отмечено</div>
          )}
          {thoughtHistory.length > 0 && (
            <div className="desire-detail-history">
              {thoughtHistory.map((contact) => (
                <div key={contact.id} className="desire-detail-history-item">
                  <span className="desire-detail-history-date">{formatDate(contact.date)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Блок шагов */}
        <div className="desire-detail-section">
          <div className="desire-detail-section-header">
            <h2 className="desire-detail-section-title">Шаги</h2>
            <button
              className="desire-detail-history-button-small"
              onClick={() => setShowStepHistory(true)}
              title="История шагов"
            >
              История шагов
            </button>
          </div>
          <textarea
            className="desire-detail-entry-input"
            value={stepText}
            onChange={(e) => setStepText(e.target.value)}
            onBlur={handleSaveStep}
            placeholder="Что это был за шаг? (необязательно)"
            rows={4}
            disabled={isSaving}
          />
          {stepText.trim() !== (todayStep?.text || '').trim() && stepText.trim() && (
            <button
              className="desire-detail-save-button"
              onClick={handleSaveStep}
              disabled={isSaving}
            >
              {isSaving ? 'Сохранение...' : 'Сохранить шаг'}
            </button>
          )}
          {saveConfirmation === 'step' && (
            <div className="desire-detail-confirmation">✓ Сохранено</div>
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
          <h2 className="desire-detail-section-title desire-detail-section-title-spaced">Дополнительно</h2>
          <div className="desire-detail-actions">
            <button
              className="desire-detail-secondary-button"
              onClick={handleEditTitle}
            >
              Изменить название
            </button>
            <button
              className="desire-detail-secondary-button"
              onClick={() => setShowEditImagesModal(true)}
            >
              Изменить изображения
            </button>
            <button
              className="desire-detail-secondary-button"
              onClick={handleEditDetails}
            >
              Изменить описание
            </button>
            <div className="desire-detail-actions-divider"></div>
            <button
              className="desire-detail-delete-button"
              onClick={handleDeleteDesire}
            >
              Удалить желание
            </button>
          </div>
        </div>
      </div>

      {/* Модальное окно истории записей */}
      {showEntryHistory && (
        <div className="desire-detail-history-modal-overlay" onClick={() => setShowEntryHistory(false)}>
          <div className="desire-detail-history-modal" onClick={(e) => e.stopPropagation()}>
            <div className="desire-detail-history-modal-header">
              <h2>История записей</h2>
              <button
                className="desire-detail-history-modal-close"
                onClick={() => setShowEntryHistory(false)}
              >
                ×
              </button>
            </div>
            <div className="desire-detail-history-modal-content">
              {entryHistory.length === 0 ? (
                <p className="desire-detail-history-empty">История пуста</p>
              ) : (
                (() => {
                  // Группируем записи по датам
                  const grouped = entryHistory.reduce((acc, contact) => {
                    const date = contact.date;
                    if (!acc[date]) {
                      acc[date] = [];
                    }
                    acc[date].push(contact);
                    return acc;
                  }, {} as Record<string, Contact[]>);

                  // Сортируем даты по убыванию
                  const sortedDates = Object.keys(grouped).sort((a, b) => 
                    new Date(b).getTime() - new Date(a).getTime()
                  );

                  return sortedDates.map((date) => (
                    <div key={date} className="desire-detail-history-group">
                      <div className="desire-detail-history-group-date">{formatDate(date)}</div>
                      {grouped[date].map((contact) => (
                        <div key={contact.id} className="desire-detail-history-modal-item">
                          {contact.text && (
                            <div className="desire-detail-history-modal-text">{contact.text}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ));
                })()
              )}
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно истории шагов */}
      {showStepHistory && (
        <div className="desire-detail-history-modal-overlay" onClick={() => setShowStepHistory(false)}>
          <div className="desire-detail-history-modal" onClick={(e) => e.stopPropagation()}>
            <div className="desire-detail-history-modal-header">
              <h2>История шагов</h2>
              <button
                className="desire-detail-history-modal-close"
                onClick={() => setShowStepHistory(false)}
              >
                ×
              </button>
            </div>
            <div className="desire-detail-history-modal-content">
              {stepHistory.length === 0 ? (
                <p className="desire-detail-history-empty">История пуста</p>
              ) : (
                (() => {
                  // Группируем шаги по датам
                  const grouped = stepHistory.reduce((acc, contact) => {
                    const date = contact.date;
                    if (!acc[date]) {
                      acc[date] = [];
                    }
                    acc[date].push(contact);
                    return acc;
                  }, {} as Record<string, Contact[]>);

                  // Сортируем даты по убыванию
                  const sortedDates = Object.keys(grouped).sort((a, b) => 
                    new Date(b).getTime() - new Date(a).getTime()
                  );

                  return sortedDates.map((date) => (
                    <div key={date} className="desire-detail-history-group">
                      <div className="desire-detail-history-group-date">{formatDate(date)}</div>
                      {grouped[date].map((contact) => (
                        <div key={contact.id} className="desire-detail-history-modal-item">
                          {contact.text && (
                            <div className="desire-detail-history-modal-text">{contact.text}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ));
                })()
              )}
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования названия */}
      {showEditTitleModal && (
        <div className="desire-detail-history-modal-overlay" onClick={() => setShowEditTitleModal(false)}>
          <div className="desire-detail-history-modal" onClick={(e) => e.stopPropagation()}>
            <div className="desire-detail-history-modal-header">
              <h2>Изменить название</h2>
              <button
                className="desire-detail-history-modal-close"
                onClick={() => setShowEditTitleModal(false)}
              >
                ×
              </button>
            </div>
            <div className="desire-detail-history-modal-content">
              <div className="desire-detail-edit-form">
                <input
                  type="text"
                  className="desire-detail-edit-input"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  placeholder="Название желания"
                  autoFocus
                />
                <div className="desire-detail-edit-form-actions">
                  <button
                    className="desire-detail-save-button"
                    onClick={handleSaveTitle}
                    disabled={isSaving || !editingTitle.trim()}
                  >
                    {isSaving ? 'Сохранение...' : 'Сохранить'}
                  </button>
                  <button
                    className="desire-detail-cancel-button"
                    onClick={() => setShowEditTitleModal(false)}
                    disabled={isSaving}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования описания */}
      {showEditDetailsModal && (
        <div className="desire-detail-history-modal-overlay" onClick={() => setShowEditDetailsModal(false)}>
          <div className="desire-detail-history-modal" onClick={(e) => e.stopPropagation()}>
            <div className="desire-detail-history-modal-header">
              <h2>Изменить описание</h2>
              <button
                className="desire-detail-history-modal-close"
                onClick={() => setShowEditDetailsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="desire-detail-history-modal-content">
              <div className="desire-detail-edit-form">
                <p className="desire-detail-edit-hint">
                  Чем подробнее образ, тем легче к нему возвращаться
                </p>
                <textarea
                  className="desire-detail-edit-textarea"
                  value={editingDetails}
                  onChange={(e) => setEditingDetails(e.target.value)}
                  placeholder="Как это выглядит?
Где ты?
Что вокруг тебя?
Кто рядом?
Что ты делаешь?"
                  rows={8}
                  autoFocus
                />
                <div className="desire-detail-edit-form-actions">
                  <button
                    className="desire-detail-save-button"
                    onClick={handleSaveDetails}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Сохранение...' : 'Сохранить'}
                  </button>
                  <button
                    className="desire-detail-cancel-button"
                    onClick={() => setShowEditDetailsModal(false)}
                    disabled={isSaving}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования изображений */}
      {showEditImagesModal && desire && (
        <div className="desire-detail-history-modal-overlay" onClick={() => setShowEditImagesModal(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <ImageEditor
              images={desire.images || []}
              onSave={async (images: DesireImage[]) => {
                setIsSaving(true);
                try {
                  await desireService.updateDesire(desire.id, { images });
                  setShowEditImagesModal(false);
                  await loadDesire();
                } catch (error) {
                  console.error('Ошибка при сохранении изображений:', error);
                  alert('Не удалось сохранить изображения');
                } finally {
                  setIsSaving(false);
                }
              }}
              onCancel={() => setShowEditImagesModal(false)}
              maxImages={6}
            />
          </div>
        </div>
      )}
    </div>
  );
}

