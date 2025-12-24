import { useState, useEffect } from 'react';
import './Header.css';

interface HeaderProps {
  onSettingsClick?: () => void;
  onLogoClick?: () => void;
}

export default function Header({ onSettingsClick, onLogoClick }: HeaderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
  });

  useEffect(() => {
    // Применяем тему к документу
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className="app-header">
      <div className="header-content">
        {/* Логотип */}
        <button 
          className="header-logo" 
          onClick={onLogoClick}
          aria-label="На главную"
        >
          <span className="logo-icon">📅</span>
          <span className="logo-text">Календарь желаний</span>
        </button>

        <div className="header-actions">
          {/* Переключение темы - Toggle Switch */}
          <button
            className={`theme-toggle-switch ${theme === 'dark' ? 'theme-toggle-dark' : 'theme-toggle-light'}`}
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему'}
            type="button"
          >
            <span className="theme-toggle-slider">
              <span className="theme-toggle-icon">
                {theme === 'dark' ? '🌙' : '☀️'}
              </span>
            </span>
          </button>

          {/* Настройки */}
          <button
            className="header-settings"
            onClick={onSettingsClick}
            aria-label="Настройки"
          >
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
}

