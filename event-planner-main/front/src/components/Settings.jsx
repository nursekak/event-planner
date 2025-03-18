import { useState, useEffect } from 'react';

const Settings = ({ onBack }) => {
  const [settings, setSettings] = useState({
    notifications: localStorage.getItem('notifications') === 'true',
    darkMode: localStorage.getItem('darkMode') === 'true',
    language: localStorage.getItem('language') || 'ru',
    emailNotifications: localStorage.getItem('emailNotifications') === 'true'
  });

  // Применяем темную тему при загрузке компонента
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-theme', isDarkMode);
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    localStorage.setItem(key, value);

    // Применяем темную тему
    if (key === 'darkMode') {
      document.body.classList.toggle('dark-theme', value);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Настройки</h2>
        <button onClick={onBack} className="back-btn">
          Назад
        </button>
      </div>

      <div className="settings-content">
        <div className="settings-group">
          <h3>Общие настройки</h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <label htmlFor="notifications">Уведомления</label>
              <span className="setting-description">Получать уведомления о событиях</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                id="notifications"
                checked={settings.notifications}
                onChange={(e) => handleChange('notifications', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label htmlFor="darkMode">Темная тема</label>
              <span className="setting-description">Включить темную тему оформления</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                id="darkMode"
                checked={settings.darkMode}
                onChange={(e) => handleChange('darkMode', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label htmlFor="language">Язык</label>
              <span className="setting-description">Выберите язык интерфейса</span>
            </div>
            <select
              id="language"
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="settings-select"
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="settings-group">
          <h3>Уведомления по email</h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <label htmlFor="emailNotifications">Email уведомления</label>
              <span className="setting-description">Получать уведомления на email</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={settings.emailNotifications}
                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 