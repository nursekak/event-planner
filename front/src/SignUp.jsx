import { useState } from 'react';

export default function SignUp({ onSignUp, onSwitchToSignIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSignUp(email, password);
    };

    return (
        <div className="auth-form">
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
