import { useState, useEffect } from 'react';

export default function Profile({ onBack, userEmail, onUpdateProfile }) {
    // Сохраняем начальные значения в отдельном состоянии
    const [initialValues, setInitialValues] = useState({
        name: localStorage.getItem('userName') || '',
        phone: localStorage.getItem('userPhone') || '',
        photo: localStorage.getItem('userPhoto') || ''
    });

    const [profile, setProfile] = useState({
        name: initialValues.name,
        email: userEmail || '',
        phone: initialValues.phone,
        photo: initialValues.photo,
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

    // Обновляем начальные значения при изменении данных в localStorage
    useEffect(() => {
        setInitialValues({
            name: localStorage.getItem('userName') || '',
            phone: localStorage.getItem('userPhone') || '',
            photo: localStorage.getItem('userPhoto') || ''
        });
    }, []);

    useEffect(() => {
        if (isEditing) {
            // Удаляем класс initial-render после первого рендера
            const form = document.querySelector('.profile-form');
            if (form) {
                setTimeout(() => {
                    form.classList.remove('initial-render');
                }, 100);
            }
        }
    }, [isEditing]);

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
        
        // Если форма отправляется сразу после входа в режим редактирования, игнорируем
        if (e.target.classList.contains('initial-render')) {
            return;
        }

        setError('');
        
        if (!validateForm()) {
            return;
        }

        // Проверяем, были ли сделаны изменения, сравнивая с начальными значениями
        const hasChanges = 
            profile.name !== initialValues.name ||
            profile.phone !== initialValues.phone ||
            previewImage !== initialValues.photo ||
            passwords.newPassword;

        if (!hasChanges) {
            setError('Нет изменений для сохранения');
            return;
        }

        try {
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

            if (passwords.newPassword) {
                updatedProfile.oldPassword = passwords.oldPassword;
                updatedProfile.newPassword = passwords.newPassword;
            }

            // Вызываем функцию обновления в родительском компоненте
            onUpdateProfile(updatedProfile);

            // Обновляем начальные значения после успешного сохранения
            setInitialValues({
                name: profile.name,
                phone: profile.phone,
                photo: previewImage || profile.photo
            });

            setProfile(updatedProfile);
            setPasswords({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setIsEditing(false);
            setSuccessMessage('Профиль успешно обновлен');
            
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            setError('Произошла ошибка при обновлении профиля');
        }
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

    const handleCancel = () => {
        setIsEditing(false);
        setError('');
        setSuccessMessage('');
        setPasswords({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        // Возвращаем к начальным значениям при отмене
        setProfile({
            name: initialValues.name,
            email: userEmail || '',
            phone: initialValues.phone,
            photo: initialValues.photo
        });
        setPreviewImage(initialValues.photo);
    };

    const startEditing = () => {
        setIsEditing(true);
        setError('');
        setSuccessMessage('');
        setInitialValues({
            name: profile.name,
            phone: profile.phone,
            photo: profile.photo
        });
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

                <form 
                    onSubmit={handleSubmit} 
                    className={`profile-form ${isEditing ? 'initial-render' : ''}`}
                >
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
                                onClick={startEditing}
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
                                    onClick={handleCancel}
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