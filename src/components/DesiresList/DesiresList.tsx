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
  entryDays: number;
  thoughtDays: number;
  stepDays: number;
}

export default function DesiresList({ onDesireClick, onAddDesire }: DesiresListProps) {
  const [desires, setDesires] = useState<DesireWithContacts[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDesires = async () => {
    setIsLoading(true);
    try {
      const allDesires = await desireService.getAllDesires();
      
      // Загружаем контакты для каждого желания
      const desiresWithContacts = await Promise.all(
        allDesires.map(async (desire) => {
          const entryDays = await contactService.getContactDaysLast7Days(desire.id, 'entry');
          const thoughtDays = await contactService.getContactDaysLast7Days(desire.id, 'thought');
          const stepDays = await contactService.getContactDaysLast7Days(desire.id, 'step');
          return { 
            ...desire, 
            entryDays,
            thoughtDays,
            stepDays,
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
    // Устанавливаем фокус на желание
    await desireService.setFocusDesire(desire.id);
    // Обновляем список для отображения нового фокуса
    await loadDesires();
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
            У тебя {desires.length} {desires.length === 1 ? 'желание' : desires.length < 5 ? 'желания' : 'желаний'}
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
                  {/* Название желания - сверху слева */}
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
                    {desire.imageUrl ? (
                      <img src={desire.imageUrl} alt={desire.title} />
                    ) : (
                      <div className="desire-card-image-placeholder"></div>
                    )}
                  </div>

                  {/* Блок "Контакт за 7 дней" - справа */}
                  <div className="desire-card-contacts-block">
                    <p className="desire-card-contacts-label">Контакт за 7 дней:</p>
                    <ContactIndicators
                      entryDays={desire.entryDays}
                      thoughtDays={desire.thoughtDays}
                      stepDays={desire.stepDays}
                      size="small"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Кнопка добавления желания */}
        <button className="desires-list-add-button" onClick={onAddDesire}>
          Добавить желание
        </button>
      </div>
    </>
  );
}
