import { useState } from 'react';

export default function SignUp({ onSignUp, onSwitchToSignIn }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const validateForm = () => {
    if (formData.name.trim().length < 2) {
      setError('Имя должно содержать минимум 2 символа');
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Введите корректный email');
      return false;
    }
    if (!formData.phone.match(/^\+7\d{10}$/)) {
      setError('Введите корректный номер телефона в формате +7XXXXXXXXXX');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      // Сохраняем имя пользователя в localStorage
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userPhone', formData.phone);
      
      // Вызываем функцию регистрации
      onSignUp(formData.email, formData.password, formData.name, formData.phone);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Форматирование номера телефона
    if (name === 'phone') {
      if (value === '') {
        formattedValue = '+7';
      } else if (!value.startsWith('+7')) {
        formattedValue = '+7' + value.replace(/[^\d]/g, '');
      } else {
        formattedValue = value.replace(/[^\d+]/g, '');
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    setError('');
  };

  return (
    <div className="auth-form">
      <h2>Регистрация</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Имя:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите ваше имя"
            required
            minLength="2"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@mail.com"
            required
          />
        </div>
        <div className="form-group">
          <label>Телефон:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+7XXXXXXXXXX"
            required
            pattern="^\+7\d{10}$"
          />
          <small className="input-hint">Формат: +7XXXXXXXXXX</small>
        </div>
        <div className="form-group">
          <label>Пароль:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Минимум 6 символов"
            required
            minLength="6"
          />
        </div>
        <div className="form-group">
          <label>Подтвердите пароль:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Повторите пароль"
            required
          />
        </div>
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p>
        Уже есть аккаунт?{' '}
        <button onClick={onSwitchToSignIn} className="switch-btn">
          Войти
        </button>
      </p>
    </div>
  );
}
