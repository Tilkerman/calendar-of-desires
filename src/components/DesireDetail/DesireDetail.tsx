import { useState, useEffect } from 'react';
import type { Desire, Contact, DesireImage } from '../../types';
import { desireService, contactService } from '../../services/db';
import ContactIndicators from '../ContactIndicators/ContactIndicators';
import ImageGallery from '../ImageGallery/ImageGallery';
import ImageEditor from '../ImageEditor/ImageEditor';
import { formatDate, getTodayDateString } from '../../utils/date';
import './DesireDetail.css';
import { useI18n } from '../../i18n';
import HeaderActions from '../Header/HeaderActions';

interface DesireDetailProps {
  desireId: string;
  onBack: () => void;
}

export default function DesireDetail({ desireId, onBack }: DesireDetailProps) {
  const { t, locale } = useI18n();
  const [desire, setDesire] = useState<Desire | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Контакты за последние 7 дней (отдельно для каждого типа)
  const [last7Days, setLast7Days] = useState<Array<{ date: string; types: Array<'entry' | 'thought' | 'step'> }>>([]);
  
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

      // Загружаем сводку по последним 7 дням
      const summary = await contactService.getLast7DaysSummary(desireId);
      setLast7Days(summary);

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
      alert(type === 'entry' ? t('detail.error.saveNote') : t('detail.error.saveStep'));
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
      alert(t('detail.error.saveDescription'));
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
      alert(t('detail.error.saveTitle'));
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
      alert(t('detail.error.saveDescription'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDesire = async () => {
    if (!desire) return;
    
    const confirmed = window.confirm(t('detail.deleteConfirm', { title: desire.title }));
    if (!confirmed) return;

    try {
      await desireService.deleteDesire(desire.id);
      onBack();
    } catch (error) {
      console.error('Ошибка при удалении желания:', error);
      alert(t('detail.error.deleteWish'));
    }
  };

  if (isLoading) {
    return (
      <div className="desire-detail-loading">
        <div>{t('common.loading')}</div>
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
        <button className="desire-detail-back" onClick={onBack} aria-label={t('common.back')}>
          <span className="back-arrow">←</span>
          <span className="back-text">{t('common.back')}</span>
        </button>
        <h1 className="desire-detail-title">{desire.title}</h1>
        <HeaderActions />
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
          <h2 className="desire-detail-section-title">{t('detail.contact7days.title')}</h2>
          <ContactIndicators
            days={last7Days}
            mode="byType"
            size="large"
          />
          <p className="desire-detail-contact-hint">
            {t('detail.contact7days.hint')}
          </p>
        </div>

        {/* Блок записей */}
        <div className="desire-detail-section">
          <div className="desire-detail-section-header">
            <h2 className="desire-detail-section-title">{t('detail.notes.title')}</h2>
            <button
              className="desire-detail-history-button-small"
              onClick={() => setShowEntryHistory(true)}
              title={t('detail.notes.history')}
            >
              {t('detail.notes.history')}
            </button>
          </div>
          <textarea
            className="desire-detail-entry-input"
            value={entryText}
            onChange={(e) => setEntryText(e.target.value)}
            onBlur={handleSaveEntry}
            placeholder={t('detail.notes.placeholder')}
            rows={4}
            disabled={isSaving}
          />
          {entryText.trim() !== (todayEntry?.text || '').trim() && entryText.trim() && (
            <button
              className="desire-detail-save-button"
              onClick={handleSaveEntry}
              disabled={isSaving}
            >
              {isSaving ? t('common.saving') : t('common.save')}
            </button>
          )}
          {saveConfirmation === 'entry' && (
            <div className="desire-detail-confirmation">{t('detail.saved')}</div>
          )}
        </div>

        {/* Блок мыслей */}
        <div className="desire-detail-section">
          <h2 className="desire-detail-section-title desire-detail-section-title-spaced">{t('detail.thoughts.title')}</h2>
          <button
            className={`desire-detail-action-button ${todayThought ? 'desire-detail-action-button-done' : ''}`}
            onClick={handleThoughtClick}
            disabled={isSaving || !!todayThought}
          >
            {todayThought ? t('detail.thoughts.done') : t('detail.thoughts.action')}
          </button>
          {saveConfirmation === 'thought' && (
            <div className="desire-detail-confirmation">{t('detail.marked')}</div>
          )}
          {thoughtHistory.length > 0 && (
            <div className="desire-detail-history">
              {thoughtHistory.map((contact) => (
                <div key={contact.id} className="desire-detail-history-item">
                  <span className="desire-detail-history-date">{formatDate(contact.date, locale)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Блок шагов */}
        <div className="desire-detail-section">
          <div className="desire-detail-section-header">
            <h2 className="desire-detail-section-title">{t('detail.step.title')}</h2>
            <button
              className="desire-detail-history-button-small"
              onClick={() => setShowStepHistory(true)}
              title={t('detail.step.history')}
            >
              {t('detail.step.history')}
            </button>
          </div>
          <textarea
            className="desire-detail-entry-input"
            value={stepText}
            onChange={(e) => setStepText(e.target.value)}
            onBlur={handleSaveStep}
            placeholder={t('detail.step.placeholder')}
            rows={4}
            disabled={isSaving}
          />
          {stepText.trim() !== (todayStep?.text || '').trim() && stepText.trim() && (
            <button
              className="desire-detail-save-button"
              onClick={handleSaveStep}
              disabled={isSaving}
            >
              {isSaving ? t('common.saving') : t('detail.step.save')}
            </button>
          )}
          {saveConfirmation === 'step' && (
            <div className="desire-detail-confirmation">{t('detail.saved')}</div>
          )}
        </div>

        {/* Эмоциональное описание */}
        <div className="desire-detail-section">
          <h2 className="desire-detail-section-title">{t('detail.feelings.title')}</h2>
          {isEditingDescription ? (
            <div className="desire-detail-description-edit">
              <textarea
                className="desire-detail-description-input"
                value={editingDescription}
                onChange={(e) => setEditingDescription(e.target.value)}
                placeholder={t('form.feelings.placeholder')}
                rows={3}
              />
              <div className="desire-detail-description-actions">
                <button
                  className="desire-detail-save-button"
                  onClick={handleSaveDescription}
                  disabled={isSaving}
                >
                  {t('common.save')}
                </button>
                <button
                  className="desire-detail-cancel-button"
                  onClick={() => {
                    setEditingDescription(desire.description);
                    setIsEditingDescription(false);
                  }}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          ) : (
            <div className="desire-detail-description-view">
              <p>{desire.description || t('detail.feelings.notSet')}</p>
              <button
                className="desire-detail-edit-button"
                onClick={() => setIsEditingDescription(true)}
              >
                {t('detail.edit')}
              </button>
            </div>
          )}
        </div>

        {/* Ориентир по времени */}
        {desire.deadline && (
          <div className="desire-detail-section">
            <h2 className="desire-detail-section-title">{t('detail.timeHint.title')}</h2>
            <p className="desire-detail-deadline">
              {new Date(desire.deadline).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="desire-detail-deadline-hint">
              {t('detail.timeHint.notDeadline')}
            </p>
          </div>
        )}

        {/* Дополнительные действия */}
        <div className="desire-detail-section">
          <h2 className="desire-detail-section-title desire-detail-section-title-spaced">{t('detail.extra.title')}</h2>
          <div className="desire-detail-actions">
            <button
              className="desire-detail-secondary-button"
              onClick={handleEditTitle}
            >
              {t('detail.editTitle')}
            </button>
            <button
              className="desire-detail-secondary-button"
              onClick={() => setShowEditImagesModal(true)}
            >
              {t('detail.editImages')}
            </button>
            <button
              className="desire-detail-secondary-button"
              onClick={handleEditDetails}
            >
              {t('detail.editDetails')}
            </button>
            <button
              className="desire-detail-delete-button"
              onClick={handleDeleteDesire}
            >
              {t('detail.deleteWish')}
            </button>
          </div>
        </div>
      </div>

      {/* Модальное окно истории записей */}
      {showEntryHistory && (
        <div className="desire-detail-history-modal-overlay" onClick={() => setShowEntryHistory(false)}>
          <div className="desire-detail-history-modal" onClick={(e) => e.stopPropagation()}>
            <div className="desire-detail-history-modal-header">
              <h2>{t('detail.modal.notesHistory.title')}</h2>
              <button
                className="desire-detail-history-modal-close"
                onClick={() => setShowEntryHistory(false)}
                aria-label={t('common.close')}
              >
                ×
              </button>
            </div>
            <div className="desire-detail-history-modal-content">
              {entryHistory.length === 0 ? (
                <p className="desire-detail-history-empty">{t('detail.modal.empty')}</p>
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
                      <div className="desire-detail-history-group-date">{formatDate(date, locale)}</div>
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
              <h2>{t('detail.modal.stepsHistory.title')}</h2>
              <button
                className="desire-detail-history-modal-close"
                onClick={() => setShowStepHistory(false)}
                aria-label={t('common.close')}
              >
                ×
              </button>
            </div>
            <div className="desire-detail-history-modal-content">
              {stepHistory.length === 0 ? (
                <p className="desire-detail-history-empty">{t('detail.modal.empty')}</p>
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
                      <div className="desire-detail-history-group-date">{formatDate(date, locale)}</div>
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
              <h2>{t('detail.modal.editTitle.title')}</h2>
              <button
                className="desire-detail-history-modal-close"
                onClick={() => setShowEditTitleModal(false)}
                aria-label={t('common.close')}
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
                  placeholder={t('form.title.label')}
                  autoFocus
                />
                <div className="desire-detail-edit-form-actions">
                  <button
                    className="desire-detail-save-button"
                    onClick={handleSaveTitle}
                    disabled={isSaving || !editingTitle.trim()}
                  >
                    {isSaving ? t('common.saving') : t('common.save')}
                  </button>
                  <button
                    className="desire-detail-cancel-button"
                    onClick={() => setShowEditTitleModal(false)}
                    disabled={isSaving}
                  >
                    {t('common.cancel')}
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
              <h2>{t('detail.modal.editDetails.title')}</h2>
              <button
                className="desire-detail-history-modal-close"
                onClick={() => setShowEditDetailsModal(false)}
                aria-label={t('common.close')}
              >
                ×
              </button>
            </div>
            <div className="desire-detail-history-modal-content">
              <div className="desire-detail-edit-form">
                <p className="desire-detail-edit-hint">
                  {t('detail.modal.editDetails.hint')}
                </p>
                <textarea
                  className="desire-detail-edit-textarea"
                  value={editingDetails}
                  onChange={(e) => setEditingDetails(e.target.value)}
                  placeholder={t('form.details.placeholder')}
                  rows={8}
                  autoFocus
                />
                <div className="desire-detail-edit-form-actions">
                  <button
                    className="desire-detail-save-button"
                    onClick={handleSaveDetails}
                    disabled={isSaving}
                  >
                    {isSaving ? t('common.saving') : t('common.save')}
                  </button>
                  <button
                    className="desire-detail-cancel-button"
                    onClick={() => setShowEditDetailsModal(false)}
                    disabled={isSaving}
                  >
                    {t('common.cancel')}
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
                  alert(t('detail.error.saveImages'));
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

