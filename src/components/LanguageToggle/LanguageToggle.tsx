import './LanguageToggle.css';
import { useI18n } from '../../i18n';

export default function LanguageToggle() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="lang-toggle" aria-label={t('header.langLabel')}>
      <button
        type="button"
        className={`lang-toggle-btn ${locale === 'en' ? 'active' : ''}`}
        onClick={() => setLocale('en')}
      >
        {t('header.lang.en')}
      </button>
      <button
        type="button"
        className={`lang-toggle-btn ${locale === 'ru' ? 'active' : ''}`}
        onClick={() => setLocale('ru')}
      >
        {t('header.lang.ru')}
      </button>
    </div>
  );
}


