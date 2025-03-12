import { useState, useEffect } from 'react';

export default function Profile({ onBack, userEmail, onUpdateProfile }) {
    const [profile, setProfile] = useState({
        name: localStorage.getItem('userName') || '',
        email: userEmail || '',
        phone: localStorage.getItem('userPhone') || '',
        photo: localStorage.getItem('userPhoto') || '',
    });
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [previewImage, setPreviewImage] = useState(profile.photo);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB
                setError('Размер файла не должен превышать 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setError('');
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        if (profile.name.trim().length < 2) {
            setError('Имя должно содержать минимум 2 символа');
            return false;
        }
        if (!profile.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Введите корректный email');
            return false;
        }
        if (!profile.phone.match(/^\+7\d{10}$/)) {
            setError('Введите корректный номер телефона в формате +7XXXXXXXXXX');
            return false;
        }
        
        // Проверка паролей только если пользователь пытается их изменить
        if (passwords.newPassword || passwords.oldPassword || passwords.confirmPassword) {
            if (!passwords.oldPassword) {
                setError('Введите текущий пароль');
                return false;
            }
            if (passwords.newPassword.length < 6) {
                setError('Новый пароль должен содержать минимум 6 символов');
                return false;
            }
            if (passwords.newPassword !== passwords.confirmPassword) {
                setError('Новые пароли не совпадают');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        
        if (!validateForm()) {
            return;
        }

        // Сохраняем данные в localStorage
        localStorage.setItem('userName', profile.name);
        localStorage.setItem('userPhone', profile.phone);
        if (previewImage) {
            localStorage.setItem('userPhoto', previewImage);
        }

        const updatedProfile = {
            ...profile,
            photo: previewImage || profile.photo
        };

        // Если есть изменения в пароле, добавляем их в обновленный профиль
        if (passwords.newPassword) {
            updatedProfile.oldPassword = passwords.oldPassword;
            updatedProfile.newPassword = passwords.newPassword;
        }

        // Вызываем функцию обновления в родительском компоненте
        onUpdateProfile(updatedProfile);

        setProfile(updatedProfile);
        setPasswords({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setIsEditing(false);
        setSuccessMessage('Профиль успешно обновлен');
        
        // Скрываем сообщение об успехе через 3 секунды
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
    };

    const handlePhoneChange = (e) => {
        let value = e.target.value;
        
        if (value === '') {
            value = '+7';
        } else if (!value.startsWith('+7')) {
            value = '+7' + value.replace(/[^\d]/g, '');
        } else {
            value = value.replace(/[^\d+]/g, '');
        }

        setProfile(prev => ({
            ...prev,
            phone: value
        }));
        setError('');
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Профиль пользователя</h2>
                <button onClick={onBack} className="back-btn">
                    Назад
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <div className="profile-content">
                <div className="profile-photo">
                    <img 
                        src={previewImage || '/default-avatar.png'} 
                        alt="Фото профиля"
                        className="profile-image"
                    />
                    {isEditing && (
                        <div className="photo-upload">
                            <label htmlFor="photo-input" className="photo-upload-label">
                                Изменить фото
                            </label>
                            <input
                                id="photo-input"
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="photo-input"
                            />
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label>Имя:</label>
                        <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => {
                                setProfile({...profile, name: e.target.value});
                                setError('');
                            }}
                            disabled={!isEditing}
                            placeholder="Введите ваше имя"
                            minLength="2"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => {
                                setProfile({...profile, email: e.target.value});
                                setError('');
                            }}
                            disabled={!isEditing}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Телефон:</label>
                        <input
                            type="tel"
                            value={profile.phone}
                            onChange={handlePhoneChange}
                            disabled={!isEditing}
                            placeholder="+7XXXXXXXXXX"
                            pattern="^\+7\d{10}$"
                            required
                        />
                        {isEditing && (
                            <small className="input-hint">Формат: +7XXXXXXXXXX</small>
                        )}
                    </div>

                    {isEditing && (
                        <div className="password-section">
                            <h3>Изменение пароля</h3>
                            <div className="form-group">
                                <label>Текущий пароль:</label>
                                <input
                                    type="password"
                                    value={passwords.oldPassword}
                                    onChange={(e) => {
                                        setPasswords({...passwords, oldPassword: e.target.value});
                                        setError('');
                                    }}
                                    placeholder="Введите текущий пароль"
                                />
                            </div>

                            <div className="form-group">
                                <label>Новый пароль:</label>
                                <input
                                    type="password"
                                    value={passwords.newPassword}
                                    onChange={(e) => {
                                        setPasswords({...passwords, newPassword: e.target.value});
                                        setError('');
                                    }}
                                    placeholder="Минимум 6 символов"
                                    minLength="6"
                                />
                            </div>

                            <div className="form-group">
                                <label>Подтвердите новый пароль:</label>
                                <input
                                    type="password"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => {
                                        setPasswords({...passwords, confirmPassword: e.target.value});
                                        setError('');
                                    }}
                                    placeholder="Повторите новый пароль"
                                />
                            </div>
                        </div>
                    )}

                    <div className="profile-actions">
                        {!isEditing ? (
                            <button 
                                type="button" 
                                onClick={() => {
                                    setIsEditing(true);
                                    setError('');
                                    setSuccessMessage('');
                                }}
                                className="edit-profile-btn"
                            >
                                Редактировать профиль
                            </button>
                        ) : (
                            <>
                                <button type="submit" className="save-profile-btn">
                                    Сохранить изменения
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setIsEditing(false);
                                        setError('');
                                        setSuccessMessage('');
                                        setPasswords({
                                            oldPassword: '',
                                            newPassword: '',
                                            confirmPassword: ''
                                        });
                                        setPreviewImage(profile.photo);
                                        setProfile({
                                            ...profile,
                                            phone: localStorage.getItem('userPhone') || ''
                                        });
                                    }}
                                    className="cancel-btn"
                                >
                                    Отмена
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
} 
