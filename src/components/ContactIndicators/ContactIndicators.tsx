import { getContactIndicatorState } from '../../utils/contactIndicators';
import { NoteIcon, StepIcon, ThoughtIcon } from './ContactIcons';
import './ContactIndicators.css';

interface ContactIndicatorsProps {
  contactDays: number; // общее количество дней с контактом за 7 дней (0-7)
  size?: 'small' | 'medium' | 'large';
}

/**
 * Компонент отображает 3 иконки (📝 👣 💭), которые заполняются синхронно
 * в зависимости от общего количества дней контакта за последние 7 дней.
 * Иконки показывают регулярность контакта, а не тип действия.
 */
export default function ContactIndicators({
  contactDays,
  size = 'medium',
}: ContactIndicatorsProps) {
  // Все 3 иконки получают одинаковое состояние на основе общего количества дней
  const state = getContactIndicatorState(contactDays);

  const fillPct =
    state === 'empty'
      ? 0
      : state === 'light'
        ? 0.25
        : state === 'medium'
          ? 0.55
          : state === 'strong'
            ? 0.85
            : 1;

  return (
    <div className={`contact-indicators contact-indicators-${size}`} title={`Контакт за 7 дней: ${contactDays}/7`}>
      <div className="contact-icon" aria-label="Записи">
        <NoteIcon title="Записи" fillPct={fillPct} />
      </div>
      <div className="contact-icon" aria-label="Шаги">
        <StepIcon title="Шаги" fillPct={fillPct} />
      </div>
      <div className="contact-icon" aria-label="Мысли">
        <ThoughtIcon title="Мысли" fillPct={fillPct} />
      </div>
    </div>
  );
}

