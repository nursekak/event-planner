
import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('events');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });
  const [currentView, setCurrentView] = useState('events');
  const [currentEvent, setCurrentEvent] = useState(null);
  
  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  // Create a new event
  const createEvent = (newEvent) => {
    setEvents([...events, {
      ...newEvent,
      id: Date.now(),
      guests: [],
      tasks: [],
      expenses: [],
      budget: parseFloat(newEvent.budget) || 0,
      spent: 0
    }]);
  };

  // Delete an event
  const deleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
    if (currentEvent && currentEvent.id === eventId) {
      setCurrentEvent(null);
      setCurrentView('events');
    }
  };

  // Add guest to an event
  const addGuest = (eventId, guest) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          guests: [...event.guests, { ...guest, id: Date.now() }]
        };
      }
      return event;
    }));
  };

  // Remove guest from an event
  const removeGuest = (eventId, guestId) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          guests: event.guests.filter(guest => guest.id !== guestId)
        };
      }
      return event;
    }));
  };

  // Add task to an event
  const addTask = (eventId, task) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          tasks: [...event.tasks, { ...task, id: Date.now(), completed: false }]
        };
      }
      return event;
    }));
  };

  // Toggle task completion
  const toggleTaskCompletion = (eventId, taskId) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          tasks: event.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return event;
    }));
  };

  // Add expense to an event
  const addExpense = (eventId, expense) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        const expenseAmount = parseFloat(expense.amount) || 0;
        return {
          ...event,
          expenses: [...event.expenses, { ...expense, id: Date.now(), amount: expenseAmount }],
          spent: event.spent + expenseAmount
        };
      }
      return event;
    }));
  };

  // Check for upcoming events (within 3 days)
  const getUpcomingEvents = () => {
    const now = new Date();
    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(now.getDate() + 3);

    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= now && eventDate <= threeDaysFromNow;
    });
  };

  // Components for different views
  const EventsListView = () => (
    <div className="events-list">
      <h2>Мои мероприятия</h2>
      <div className="events-grid">
        {events.length === 0 ? (
          <p>У вас еще нет мероприятий. Создайте новое!</p>
        ) : (
          events.map(event => (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <p>Дата: {new Date(event.date).toLocaleDateString()}</p>
              <p>Место: {event.location}</p>
              <p>Бюджет: {event.budget} ₽</p>
              <p>Потрачено: {event.spent} ₽</p>
              <button onClick={() => {
                setCurrentEvent(event);
                setCurrentView('eventDetails');
              }}>Открыть</button>
              <button className="delete-btn" onClick={() => deleteEvent(event.id)}>Удалить</button>
            </div>
          ))
        )}
      </div>
      <button className="create-btn" onClick={() => setCurrentView('createEvent')}>Создать мероприятие</button>
    </div>
  );

  const CreateEventView = () => {
    const [newEvent, setNewEvent] = useState({
      title: '',
      date: '',
      location: '',
      budget: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setNewEvent({ ...newEvent, [name]: value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!newEvent.title || !newEvent.date) {
        alert('Пожалуйста, заполните название и дату мероприятия');
        return;
      }
      createEvent(newEvent);
      setCurrentView('events');
    };

    return (
      <div className="create-event">
        <h2>Создать мероприятие</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название:</label>
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Дата:</label>
            <input
              type="date"
              name="date"
              value={newEvent.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Место:</label>
            <input
              type="text"
              name="location"
              value={newEvent.location}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Бюджет (₽):</label>
            <input
              type="number"
              name="budget"
              value={newEvent.budget}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="form-actions">
            <button type="submit">Создать</button>
            <button type="button" onClick={() => setCurrentView('events')}>Отмена</button>
          </div>
        </form>
      </div>
    );
  };

  const EventDetailsView = () => {
    const [activeTab, setActiveTab] = useState('info');
    const [newGuest, setNewGuest] = useState({ name: '', email: '' });
    const [newTask, setNewTask] = useState({ description: '', dueDate: '' });
    const [newExpense, setNewExpense] = useState({ description: '', amount: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editedEvent, setEditedEvent] = useState(null);
    const [additionalInfo, setAdditionalInfo] = useState(() => {
      // Загружаем дополнительную информацию из localStorage, если она есть
      const savedInfo = localStorage.getItem(`eventInfo_${currentEvent?.id}`);
      return savedInfo || '';
    });

    useEffect(() => {
      if (currentEvent) {
        setEditedEvent({ ...currentEvent });
        const savedInfo = localStorage.getItem(`eventInfo_${currentEvent.id}`);
        setAdditionalInfo(savedInfo || '');
      }
    }, [currentEvent]);

    if (!currentEvent) return <div>Загрузка...</div>;

    const handleAddGuest = (e) => {
      e.preventDefault();
      if (!newGuest.name) return;
      addGuest(currentEvent.id, newGuest);
      setNewGuest({ name: '', email: '' });
    };

    const handleAddTask = (e) => {
      e.preventDefault();
      if (!newTask.description) return;
      addTask(currentEvent.id, newTask);
      setNewTask({ description: '', dueDate: '' });
    };

    const handleAddExpense = (e) => {
      e.preventDefault();
      if (!newExpense.description || !newExpense.amount) return;
      addExpense(currentEvent.id, newExpense);
      setNewExpense({ description: '', amount: '' });
    };

    const saveEventChanges = () => {
      if (!editedEvent.title || !editedEvent.date) {
        alert('Пожалуйста, заполните название и дату мероприятия');
        return;
      }
      
      // Обновляем событие в общем массиве
      setEvents(events.map(event => 
        event.id === currentEvent.id ? { ...event, 
          title: editedEvent.title,
          date: editedEvent.date,
          location: editedEvent.location,
          budget: parseFloat(editedEvent.budget) || 0
        } : event
      ));
      
      // Обновляем текущее событие
      setCurrentEvent({ ...currentEvent, 
        title: editedEvent.title,
        date: editedEvent.date,
        location: editedEvent.location,
        budget: parseFloat(editedEvent.budget) || 0
      });
      
      setIsEditing(false);
    };

    const handleInfoChange = (e) => {
      setAdditionalInfo(e.target.value);
      localStorage.setItem(`eventInfo_${currentEvent.id}`, e.target.value);
    };

    return (
      <div className="event-details">
        <div className="event-header">
          <h2>{currentEvent.title}</h2>
          <div>
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="edit-btn"
            >
              {isEditing ? 'Отменить' : 'Редактировать'}
            </button>
            <button onClick={() => {
              setCurrentEvent(null);
              setCurrentView('events');
            }}>Назад к списку</button>
          </div>
        </div>

        {isEditing ? (
          <div className="edit-event-form">
            <h3>Редактирование мероприятия</h3>
            <div className="form-group">
              <label>Название:</label>
              <input
                type="text"
                value={editedEvent.title}
                onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Дата:</label>
              <input
                type="date"
                value={editedEvent.date}
                onChange={(e) => setEditedEvent({ ...editedEvent, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Место:</label>
              <input
                type="text"
                value={editedEvent.location}
                onChange={(e) => setEditedEvent({ ...editedEvent, location: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Бюджет (₽):</label>
              <input
                type="number"
                value={editedEvent.budget}
                onChange={(e) => setEditedEvent({ ...editedEvent, budget: e.target.value })}
                min="0"
              />
            </div>
            <button onClick={saveEventChanges} className="save-btn">Сохранить изменения</button>
          </div>
        ) : (
          <div className="event-info">
            <p><strong>Дата:</strong> {new Date(currentEvent.date).toLocaleDateString()}</p>
            <p><strong>Место:</strong> {currentEvent.location}</p>
            <p><strong>Бюджет:</strong> {currentEvent.budget} ₽</p>
            <p><strong>Потрачено:</strong> {currentEvent.spent} ₽</p>
            <p><strong>Осталось:</strong> {(currentEvent.budget - currentEvent.spent).toFixed(2)} ₽</p>
          </div>
        )}

        <div className="tabs">
          <button 
            className={activeTab === 'info' ? 'active' : ''} 
            onClick={() => setActiveTab('info')}
          >
            Информация
          </button>
          <button 
            className={activeTab === 'guests' ? 'active' : ''} 
            onClick={() => setActiveTab('guests')}
          >
            Гости ({currentEvent.guests.length})
          </button>
          <button 
            className={activeTab === 'tasks' ? 'active' : ''} 
            onClick={() => setActiveTab('tasks')}
          >
            Задачи ({currentEvent.tasks.length})
          </button>
          <button 
            className={activeTab === 'budget' ? 'active' : ''} 
            onClick={() => setActiveTab('budget')}
          >
            Бюджет
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'info' && (
            <div className="info-tab">
              <h3>О мероприятии</h3>
              {isEditing ? (
                <textarea
                  className="additional-info-textarea"
                  placeholder="Добавьте дополнительную информацию о мероприятии..."
                  value={additionalInfo}
                  onChange={handleInfoChange}
                  rows={10}
                ></textarea>
              ) : (
                <div className="info-display">
                  {additionalInfo ? 
                    <div className="additional-info-text">{additionalInfo}</div> : 
                    <p className="no-info">Нет дополнительной информации</p>
                  }
                </div>
              )}
            </div>
          )}

          {activeTab === 'guests' && (
            <div className="guests-tab">
              <h3>Список гостей</h3>
              {isEditing && (
                <form onSubmit={handleAddGuest} className="add-form">
                  <input
                    type="text"
                    placeholder="Имя гостя"
                    value={newGuest.name}
                    onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email (необязательно)"
                    value={newGuest.email}
                    onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                  />
                  <button type="submit">Добавить гостя</button>
                </form>
              )}
              
              {currentEvent.guests.length === 0 ? (
                <p>Пока нет гостей</p>
              ) : (
                <ul className="list">
                  {currentEvent.guests.map(guest => (
                    <li key={guest.id} className="list-item">
                      <div>
                        <strong>{guest.name}</strong>
                        {guest.email && <p>{guest.email}</p>}
                      </div>
                      <button onClick={() => removeGuest(currentEvent.id, guest.id)}>Удалить</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="tasks-tab">
              <h3>Задачи</h3>
              {isEditing && (
                <form onSubmit={handleAddTask} className="add-form">
                  <input
                    type="text"
                    placeholder="Описание задачи"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    required
                  />
                  <input
                    type="date"
                    placeholder="Срок выполнения"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                  <button type="submit">Добавить задачу</button>
                </form>
              )}

              {currentEvent.tasks.length === 0 ? (
                <p>Пока нет задач</p>
              ) : (
                <ul className="list">
                  {currentEvent.tasks.map(task => (
                    <li key={task.id} className="list-item task-item">
                      <div className="task-info">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskCompletion(currentEvent.id, task.id)}
                        />
                        <span className={task.completed ? 'completed-task' : ''}>
                          {task.description}
                        </span>
                        {task.dueDate && (
                          <span className="task-due-date">
                            Срок: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="budget-tab">
              <h3>Управление бюджетом</h3>
              <div className="budget-summary">
                <p>Бюджет: {currentEvent.budget} ₽</p>
                <p>Потрачено: {currentEvent.spent} ₽</p>
                <p className={currentEvent.budget - currentEvent.spent < 0 ? 'overspent' : ''}>
                  Осталось: {(currentEvent.budget - currentEvent.spent).toFixed(2)} ₽
                </p>
              </div>

              {isEditing && (
                <>
                  <h4>Добавить расход</h4>
                  <form onSubmit={handleAddExpense} className="add-form">
                    <input
                      type="text"
                      placeholder="Описание расхода"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Сумма"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      required
                      min="0"
                      step="0.01"
                    />
                    <button type="submit">Добавить расход</button>
                  </form>
                </>
              )}

              <h4>Список расходов</h4>
              {currentEvent.expenses.length === 0 ? (
                <p>Пока нет расходов</p>
              ) : (
                <ul className="list">
                  {currentEvent.expenses.map(expense => (
                    <li key={expense.id} className="list-item">
                      <div>
                        <strong>{expense.description}</strong>
                        <p>{expense.amount} ₽</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Notifications component
  const Notifications = () => {
    const upcomingEvents = getUpcomingEvents();
    
    if (upcomingEvents.length === 0) return null;
    
    return (
      <div className="notifications">
        <h3>Уведомления</h3>
        <ul>
          {upcomingEvents.map(event => (
            <li key={event.id}>
              Скоро: {event.title} - {new Date(event.date).toLocaleDateString()}
              <button onClick={() => {
                setCurrentEvent(event);
                setCurrentView('eventDetails');
              }}>Открыть</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="app">
      <header>
        <h1>Планировщик мероприятий</h1>
      </header>
      
      <main>
        <Notifications />
        
        {currentView === 'events' && <EventsListView />}
        {currentView === 'createEvent' && <CreateEventView />}
        {currentView === 'eventDetails' && <EventDetailsView />}
      </main>
      
      <footer>
        <p>© 2023 Планировщик мероприятий</p>
      </footer>
    </div>
  );
}
