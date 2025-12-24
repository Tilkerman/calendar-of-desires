import { getContactIndicatorState } from '../../utils/contactIndicators';
import './ContactIndicators.css';

interface ContactIndicatorsProps {
  entryDays: number;    // дни с контактом типа "entry" за 7 дней
  thoughtDays: number; // дни с контактом типа "thought" за 7 дней
  stepDays: number;    // дни с контактом типа "step" за 7 дней
  size?: 'small' | 'medium' | 'large';
}

export default function ContactIndicators({
  entryDays,
  thoughtDays,
  stepDays,
  size = 'medium',
}: ContactIndicatorsProps) {
  const entryState = getContactIndicatorState(entryDays);
  const thoughtState = getContactIndicatorState(thoughtDays);
  const stepState = getContactIndicatorState(stepDays);

  return (
    <div className={`contact-indicators contact-indicators-${size}`}>
      <div 
        className={`contact-icon contact-icon-entry contact-icon-${entryState}`}
      >
        📝
      </div>
      <div 
        className={`contact-icon contact-icon-step contact-icon-${stepState}`}
      >
        👣
      </div>
      <div 
        className={`contact-icon contact-icon-thought contact-icon-${thoughtState}`}
      >
        💭
      </div>
    </div>
  );
}

