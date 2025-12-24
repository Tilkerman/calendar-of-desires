import './WelcomeScreen.css';

interface WelcomeScreenProps {
  onCreateDesire: () => void;
}

export default function WelcomeScreen({ onCreateDesire }: WelcomeScreenProps) {
  return (
    <div className="welcome-screen">
      {/* Заголовок */}
      <h1 className="welcome-title">
        Календарь желаний
      </h1>

      {/* Подзаголовок */}
      <p className="welcome-subtitle">
        Простое приложение,
        <br />
        чтобы не забывать о том,
        <br />
        чего ты действительно хочешь
      </p>

      {/* Основной текст */}
      <div className="welcome-text">
        <p>Здесь ты выбираешь одно желание.</p>
        <p>
          И каждый день
          <br />
          ненадолго возвращаешься к нему.
        </p>
        <p>
          Без списков задач.
          <br />
          Без давления.
          <br />
          Без «ты должен».
        </p>
      </div>

      {/* Поясняющий текст */}
      <p className="welcome-hint">
        Иногда первый шаг —
        <br />
        просто честно признаться себе,
        <br />
        чего ты хочешь.
      </p>

      {/* Основное действие */}
      <div className="welcome-actions">
        <button
          onClick={onCreateDesire}
          className="welcome-button"
        >
          Создать первое желание
        </button>

        {/* Подпись под кнопкой */}
        <p className="welcome-button-hint">
          Займёт 1–2 минуты
          <br />
          Никакой регистрации
        </p>
      </div>
    </div>
  );
}
