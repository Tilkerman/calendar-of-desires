import { useState, useEffect } from 'react';
import type { Desire } from '../../types';
import { desireService, contactService } from '../../services/db';
import Header from '../Header/Header';
import ContactIndicators from '../ContactIndicators/ContactIndicators';
import './DesiresList.css';

interface DesiresListProps {
  onDesireClick: (desire: Desire) => void;
  onAddDesire: () => void;
}

interface DesireWithContacts extends Desire {
  entryDays: number; // количество дней с контактом типа "entry" за 7 дней
  stepDays: number; // количество дней с контактом типа "step" за 7 дней
  thoughtDays: number; // количество дней с контактом типа "thought" за 7 дней
  hasTodayContact: boolean; // есть ли контакт за сегодня
}

export default function DesiresList({ onDesireClick, onAddDesire }: DesiresListProps) {
  const [desires, setDesires] = useState<DesireWithContacts[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDesires = async () => {
    setIsLoading(true);
    try {
      let allDesires = await desireService.getAllDesires();
      
      // Проверяем время - если после 23:00, сбрасываем все isActive
      const now = new Date();
      const currentHour = now.getHours();
      if (currentHour >= 23) {
        // После 23:00 сбрасываем все флаги isActive
        await Promise.all(
          allDesires
            .filter((d) => d.isActive)
            .map((d) => desireService.updateDesire(d.id, { isActive: false }))
        );
        // Перезагружаем желания после сброса
        allDesires = await desireService.getAllDesires();
      }

      // Загружаем контакты для каждого желания
      const desiresWithContacts = await Promise.all(
        allDesires.map(async (desire) => {
          // Получаем количество дней с контактом для каждого типа отдельно
          const entryDays = await contactService.getContactDaysLast7Days(desire.id, 'entry');
          const stepDays = await contactService.getContactDaysLast7Days(desire.id, 'step');
          const thoughtDays = await contactService.getContactDaysLast7Days(desire.id, 'thought');
          
          // Проверяем, есть ли контакт за сегодня (любой тип)
          const todayEntry = await contactService.getTodayContact(desire.id, 'entry');
          const todayThought = await contactService.getTodayContact(desire.id, 'thought');
          const todayStep = await contactService.getTodayContact(desire.id, 'step');
          const hasTodayContact = !!(todayEntry || todayThought || todayStep);
          
          // Если есть контакт сегодня и время до 23:00, автоматически устанавливаем isActive
          if (hasTodayContact && currentHour < 23 && !desire.isActive) {
            // Деактивируем все остальные желания
            await Promise.all(
              allDesires
                .filter((d) => d.id !== desire.id && d.isActive)
                .map((d) => desireService.updateDesire(d.id, { isActive: false }))
            );
            // Активируем текущее желание
            await desireService.updateDesire(desire.id, { isActive: true });
            desire.isActive = true;
          }
          
          // НЕ создаём контакт автоматически при загрузке!
          // Контакт создаётся ТОЛЬКО при явном действии пользователя
          
          return { 
            ...desire, 
            entryDays,
            stepDays,
            thoughtDays,
            hasTodayContact,
          };
        })
      );

      setDesires(desiresWithContacts);
    } catch (error) {
      console.error('Ошибка при загрузке желаний:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDesires();
  }, []);

  const handleDesireClick = async (desire: Desire) => {
    // При клике на желание устанавливаем его "в фокусе" (если время до 23:00)
    // НО НЕ создаём контакт автоматически! Контакт создаётся только при явном действии.
    const now = new Date();
    const currentHour = now.getHours();
    
    if (currentHour < 23) {
      // Деактивируем все остальные желания
      const allDesires = await desireService.getAllDesires();
      await Promise.all(
        allDesires
          .filter((d) => d.id !== desire.id && d.isActive)
          .map((d) => desireService.updateDesire(d.id, { isActive: false }))
      );
      
      // Активируем текущее желание
      await desireService.updateDesire(desire.id, { isActive: true });
      
      // НЕ создаём контакт автоматически!
      // Контакт создаётся ТОЛЬКО при явном действии пользователя:
      // - нажатие кнопки "Мысли сегодня" на странице деталей
      // - добавление/изменение Записи
      // - добавление/изменение Шага
      
      // Перезагружаем список для обновления индикаторов
      await loadDesires();
    }
    
    // Открываем детальный экран желания
    onDesireClick(desire);
  };

  const handleLogoClick = () => {
    // Прокрутка в начало страницы
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSettingsClick = () => {
    // Заглушка для настроек
    alert('Настройки (в разработке)');
  };

  if (isLoading) {
    return (
      <>
        <Header onLogoClick={handleLogoClick} onSettingsClick={handleSettingsClick} />
        <div className="desires-list-container">
          <div className="loading">Загрузка...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header onLogoClick={handleLogoClick} onSettingsClick={handleSettingsClick} />
      <div className="desires-list-container">
        {/* Блок информации под шапкой */}
        <div className="desires-info-block">
          {/* Количество желаний */}
          <p className="desires-count">
            Сейчас у тебя {desires.length} {desires.length === 1 ? 'желание' : desires.length < 5 ? 'желания' : 'желаний'}
          </p>

          {/* Пояснение фокуса */}
          <p className="desires-focus-instruction">
            Выбери, какое желание сегодня в фокусе
          </p>
          <p className="desires-focus-hint">
            это то, к которому ты сегодня возвращаешься
          </p>
        </div>

        {/* Карточки желаний */}
        <div className="desires-list">
          {desires.length === 0 ? (
            <div className="empty-state">
              <p>У тебя пока нет желаний</p>
              <p className="empty-state-hint">Создай первое желание, чтобы начать</p>
            </div>
          ) : (
            desires.map((desire) => (
              <div
                key={desire.id}
                className={`desire-card ${desire.isActive ? 'desire-card-focused' : ''}`}
                onClick={() => handleDesireClick(desire)}
              >
                {/* Верхняя часть: название и бейдж */}
                <div className="desire-card-header">
                  {/* Название желания - главный визуальный якорь */}
                  <h2 className="desire-card-title">{desire.title}</h2>
                  
                  {/* Метка "Сегодня в фокусе" - сверху справа */}
                  {desire.isActive && (
                    <div className="desire-card-focus-badge">
                      <span className="focus-checkmark">✓</span>
                      <span className="focus-text">Сегодня в фокусе</span>
                    </div>
                  )}
                </div>

                <div className="desire-card-content">
                  {/* Превью-изображение - слева */}
            <div className="desire-card-image">
              {(() => {
                // Получаем первое изображение из массива images или из imageUrl (legacy)
                const firstImage = desire.images && desire.images.length > 0
                  ? desire.images.sort((a, b) => a.order - b.order)[0]
                  : null;
                const imageUrl = firstImage?.url || desire.imageUrl;
                
                return imageUrl ? (
                  <img src={imageUrl} alt={desire.title} />
                ) : (
                  <div className="desire-card-image-placeholder"></div>
                );
              })()}
            </div>

                  {/* Блок "Контакт за 7 дней" - справа */}
                  <div className="desire-card-contacts-block">
                    <p className="desire-card-contacts-label">Контакт за 7 дней:</p>
                    <ContactIndicators
                      entryDays={desire.entryDays}
                      stepDays={desire.stepDays}
                      thoughtDays={desire.thoughtDays}
                      size="small"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Кнопка добавления желания - закреплена внизу */}
      <div className="desires-list-add-button-container">
        <button className="desires-list-add-button" onClick={onAddDesire}>
          Добавить желание
        </button>
      </div>
    </>
  );
}
