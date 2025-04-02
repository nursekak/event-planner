import { useState } from 'react';

export default function SignIn({ onSignIn, onSwitchToSignUp }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        onSignIn(email, password);
    };

    return (
        <div className="auth-form">
            <h2>Вход в систему</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Введите email"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Введите пароль"
                        required
                    />
                </div>

                <button type="submit" className="btn-primary">
                    Войти
                </button>
            </form>

            <p className="auth-switch">
                Нет аккаунта?{' '}
                <button onClick={onSwitchToSignUp} className="btn-link">
                    Зарегистрироваться
                </button>
            </p>
        </div>
    );
}