import { useState } from 'react';

export default function SignIn({ onSignIn, onSwitchToSignUp }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Валидация email
        if (!validateEmail(formData.email)) {
            setError('Введите корректный email');
            return;
        }

        // Проверка минимальной длины пароля
        if (formData.password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов');
            return;
        }

        // Получаем сохраненные данные пользователя
        const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const user = savedUsers.find(u => u.email === formData.email);

        if (!user) {
            setError('Пользователь с таким email не найден');
            return;
        }

        if (user.password !== formData.password) {
            setError('Неверный пароль');
            return;
        }

        // Если все проверки пройдены, вызываем функцию входа
        onSignIn(formData.email, formData.password);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    return (
        <div className="auth-form">
            <h2>Вход</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Войти</button>
            </form>
            <p>
                Нет аккаунта?{' '}
                <button onClick={onSwitchToSignUp} className="switch-btn">
                    Зарегистрироваться
                </button>
            </p>
        </div>
    );
}
