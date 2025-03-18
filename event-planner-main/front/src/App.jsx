import { useState, useEffect } from 'react';
import './App.css';
import SignUp from './SignUp.jsx';
import SignIn from './SignIn.jsx';
import Profile from './Profile.jsx';
import CreateEvent from './CreateEvent.jsx';
import EditEvent from './EditEvent.jsx';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';

export default function App() {
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('events');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });
  const [currentView, setCurrentView] = useState('events');
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState('signIn');
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, eventId: null, eventTitle: '' });

  // Add mouse tracking and ripple effect for buttons
  useEffect(() => {
    const buttons = document.querySelectorAll('.btn, button');
    
    const handleMouseMove = (e) => {
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / btn.clientWidth) * 100;
      const y = ((e.clientY - rect.top) / btn.clientHeight) * 100;
      btn.style.setProperty('--x', `${x}%`);
      btn.style.setProperty('--y', `${y}%`);
    };

    const createRipple = (e) => {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${diameter}px`;
      ripple.style.left = `${e.clientX - rect.left - radius}px`;
      ripple.style.top = `${e.clientY - rect.top - radius}px`;

      const existingRipple = button.querySelector('.ripple');
      if (existingRipple) {
        existingRipple.remove();
      }

      button.appendChild(ripple);

      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
    };

    buttons.forEach(btn => {
      btn.addEventListener('mousemove', handleMouseMove);
      btn.addEventListener('click', createRipple);
    });

    return () => {
      buttons.forEach(btn => {
        btn.removeEventListener('mousemove', handleMouseMove);
        btn.removeEventListener('click', createRipple);
      });
    };
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleSignIn = (email, password) => {
    // В реальном приложении здесь была бы проверка через API
    setIsAuthenticated(true);
    setCurrentUser({
      email,
      name: localStorage.getItem('userName') || '',
      photo: localStorage.getItem('userPhoto') || ''
    });
    setCurrentView('events');
  };

  const handleSignUp = (email, password, name) => {
    // В реальном приложении здесь была бы регистрация через API
    localStorage.setItem('userName', name);
    setIsAuthenticated(true);
    setCurrentUser({ email, name });
    setCurrentView('events');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('events');
  };

  const handleUpdateProfile = (updatedProfile) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updatedProfile
    }));
  };

  const handleDeleteEvent = (event) => {
    setDeleteModal({
      isOpen: true,
      eventId: event.id,
      eventTitle: event.title
    });
  };

  const confirmDelete = () => {
    setEvents(events.filter(e => e.id !== deleteModal.eventId));
    setDeleteModal({ isOpen: false, eventId: null, eventTitle: '' });
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <header>
          <h1>Планировщик мероприятий</h1>
        </header>
        <main>
          {authView === 'signIn' ? (
            <SignIn 
              onSignIn={handleSignIn}
              onSwitchToSignUp={() => setAuthView('signUp')}
            />
          ) : (
            <SignUp
              onSignUp={handleSignUp}
              onSwitchToSignIn={() => setAuthView('signIn')}
            />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <h1 
          onClick={() => setCurrentView('events')}
          className="header-title"
        >
          Планировщик мероприятий
        </h1>
        <div className="header-actions">
          {currentView !== 'profile' && (
            <button 
              className="profile-btn"
              onClick={() => setCurrentView('profile')}
            >
              {currentUser?.photo && (
                <img 
                  src={currentUser.photo} 
                  alt="Avatar" 
                  className="profile-btn-avatar"
                />
              )}
              {currentUser?.name || 'Профиль'}
            </button>
          )}
          <button onClick={handleSignOut} className="btn-outline">
            Выйти
          </button>
        </div>
      </header>

      <main>
        {currentView === 'profile' ? (
          <Profile
            userEmail={currentUser?.email}
            onBack={() => setCurrentView('events')}
            onUpdateProfile={handleUpdateProfile}
          />
        ) : currentView === 'createEvent' ? (
          <CreateEvent
            onSave={(newEvent) => {
              setEvents([...events, { ...newEvent, id: Date.now() }]);
              setCurrentView('events');
            }}
            onCancel={() => setCurrentView('events')}
          />
        ) : currentView === 'editEvent' ? (
          <EditEvent
            event={currentEvent}
            onSave={(updatedEvent) => {
              setEvents(events.map(e => 
                e.id === updatedEvent.id ? updatedEvent : e
              ));
              setCurrentView('events');
              setCurrentEvent(null);
            }}
            onCancel={() => {
              setCurrentView('events');
              setCurrentEvent(null);
            }}
          />
        ) : (
          <div className="events-container">
            {error && <div className="error-message">{error}</div>}
            
            <div className="events-header">
              <h2>Мои события</h2>
              <button 
                className="create-btn"
                onClick={() => {
                  setCurrentEvent(null);
                  setCurrentView('createEvent');
                }}
              >
                Создать событие
              </button>
            </div>

            {events.length === 0 ? (
              <div className="empty-state">
                <p>У вас пока нет событий. Нажмите кнопку "Создать событие", чтобы запланировать ваше первое мероприятие!</p>
              </div>
            ) : (
              <div className="events-grid">
                {events.map(event => (
                  <div key={event.id} className="event-card">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <div className="event-footer">
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <div className="event-actions">
                        <button
                          className="btn-outline btn-sm"
                          onClick={() => {
                            setCurrentEvent(event);
                            setCurrentView('editEvent');
                          }}
                        >
                          Редактировать
                        </button>
                        <button
                          className="btn-danger btn-sm"
                          onClick={() => handleDeleteEvent(event)}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, eventId: null, eventTitle: '' })}
        onConfirm={confirmDelete}
        eventTitle={deleteModal.eventTitle}
      />
    </div>
  );
}