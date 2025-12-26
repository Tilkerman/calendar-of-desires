import { getContactFillPercentage } from '../../utils/contactIndicators';
import { NoteIcon, StepIcon, ThoughtIcon } from './ContactIcons';
import './ContactIndicators.css';

interface ContactIndicatorsProps {
  entryDays: number; // количество дней с контактом типа "entry" за 7 дней (0-7)
  stepDays: number; // количество дней с контактом типа "step" за 7 дней (0-7)
  thoughtDays: number; // количество дней с контактом типа "thought" за 7 дней (0-7)
  size?: 'small' | 'medium' | 'large';
}

/**
 * Компонент отображает 3 иконки (📝 👣 💭), которые заполняются НЕЗАВИСИМО
 * в зависимости от количества дней с контактом КАЖДОГО ТИПА за последние 7 дней.
 * Каждая иконка показывает регулярность контакта именно этого типа.
 */
export default function ContactIndicators({
  entryDays,
  stepDays,
  thoughtDays,
  size = 'medium',
}: ContactIndicatorsProps) {
  // Каждая иконка заполняется независимо на основе своего типа
  const entryFillPct = getContactFillPercentage(entryDays);
  const stepFillPct = getContactFillPercentage(stepDays);
  const thoughtFillPct = getContactFillPercentage(thoughtDays);

  return (
    <div className={`contact-indicators contact-indicators-${size}`} title={`Контакт за 7 дней: Записи ${entryDays}/7, Шаги ${stepDays}/7, Мысли ${thoughtDays}/7`}>
      <div className="contact-icon" aria-label="Записи">
        <NoteIcon title="Записи" fillPct={entryFillPct} />
      </div>
      <div className="contact-icon" aria-label="Шаги">
        <StepIcon title="Шаги" fillPct={stepFillPct} />
      </div>
      <div className="contact-icon" aria-label="Мысли">
        <ThoughtIcon title="Мысли" fillPct={thoughtFillPct} />
      </div>
    </div>
  );
}

