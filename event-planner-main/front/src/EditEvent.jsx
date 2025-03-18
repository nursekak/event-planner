import { useState, useEffect } from 'react';

export default function EditEvent({ event, onSave, onCancel }) {
  const [activeTab, setActiveTab] = useState('main');
  const [editedEvent, setEditedEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    guests: [],
    budget: {
      planned: 0,
      items: []
    },
    tasks: []
  });
  const [newGuest, setNewGuest] = useState({ name: '', email: '' });
  const [newTask, setNewTask] = useState('');
  const [newBudgetItem, setNewBudgetItem] = useState({ description: '', amount: '' });

  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.date);
      setEditedEvent({
        ...event,
        date: eventDate.toISOString().split('T')[0],
        time: eventDate.toTimeString().slice(0, 5),
        guests: event.guests || [],
        budget: event.budget || { planned: 0, items: [] },
        tasks: event.tasks || []
      });
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...event,
      ...editedEvent,
      date: new Date(`${editedEvent.date}T${editedEvent.time}`).toISOString()
    });
  };

  const addGuest = (e) => {
    e.preventDefault();
    if (newGuest.name && newGuest.email) {
      setEditedEvent({
        ...editedEvent,
        guests: [...editedEvent.guests, { ...newGuest, id: Date.now() }]
      });
      setNewGuest({ name: '', email: '' });
    }
  };

  const removeGuest = (guestId) => {
    setEditedEvent({
      ...editedEvent,
      guests: editedEvent.guests.filter(guest => guest.id !== guestId)
    });
  };

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setEditedEvent({
        ...editedEvent,
        tasks: [...editedEvent.tasks, { id: Date.now(), text: newTask, completed: false }]
      });
      setNewTask('');
    }
  };

  const toggleTask = (taskId) => {
    setEditedEvent({
      ...editedEvent,
      tasks: editedEvent.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    });
  };

  const removeTask = (taskId) => {
    setEditedEvent({
      ...editedEvent,
      tasks: editedEvent.tasks.filter(task => task.id !== taskId)
    });
  };

  const addBudgetItem = (e) => {
    e.preventDefault();
    if (newBudgetItem.description && newBudgetItem.amount) {
      setEditedEvent({
        ...editedEvent,
        budget: {
          ...editedEvent.budget,
          items: [...editedEvent.budget.items, { ...newBudgetItem, id: Date.now() }]
        }
      });
      setNewBudgetItem({ description: '', amount: '' });
    }
  };

  const removeBudgetItem = (itemId) => {
    setEditedEvent({
      ...editedEvent,
      budget: {
        ...editedEvent.budget,
        items: editedEvent.budget.items.filter(item => item.id !== itemId)
      }
    });
  };

  const calculateTotalSpent = () => {
    return editedEvent.budget.items.reduce((sum, item) => sum + Number(item.amount), 0);
  };

  return (
    <div className="create-event">
      <h2>Редактирование события</h2>
      
      <div className="tabs">
        <div 
          className="tab-indicator" 
          style={{ 
            ['--translate-x']: activeTab === 'main' ? '0' :
                              activeTab === 'guests' ? 'calc(100% + 22px)' :
                              activeTab === 'tasks' ? 'calc(200% + 44px)' :
                              'calc(300% + 66px)',
            ['--translate-y']: activeTab === 'main' ? '0' :
                              activeTab === 'guests' ? 'calc(100% + 12px)' :
                              activeTab === 'tasks' ? 'calc(200% + 24px)' :
                              'calc(300% + 36px)'
          }}
        />
        <button
          className={activeTab === 'main' ? 'active' : ''}
          onClick={() => setActiveTab('main')}
        >
          Основное
        </button>
        <button
          className={activeTab === 'guests' ? 'active' : ''}
          onClick={() => setActiveTab('guests')}
        >
          Гости
        </button>
        <button
          className={activeTab === 'tasks' ? 'active' : ''}
          onClick={() => setActiveTab('tasks')}
        >
          Задачи
        </button>
        <button
          className={activeTab === 'budget' ? 'active' : ''}
          onClick={() => setActiveTab('budget')}
        >
          Бюджет
        </button>
      </div>

      {activeTab === 'main' && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название:</label>
            <input
              type="text"
              value={editedEvent.title}
              onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })}
              placeholder="Введите название события"
              required
            />
          </div>

          <div className="form-group">
            <label>Описание:</label>
            <textarea
              value={editedEvent.description}
              onChange={(e) => setEditedEvent({ ...editedEvent, description: e.target.value })}
              placeholder="Введите описание события"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Дата:</label>
            <input
              type="date"
              value={editedEvent.date}
              onChange={(e) => setEditedEvent({ ...editedEvent, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label>Время:</label>
            <input
              type="time"
              value={editedEvent.time}
              onChange={(e) => setEditedEvent({ ...editedEvent, time: e.target.value })}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Сохранить
            </button>
            <button type="button" onClick={onCancel} className="btn-outline">
              Отмена
            </button>
          </div>
        </form>
      )}

      {activeTab === 'guests' && (
        <div className="guests-section">
          <form onSubmit={addGuest} className="add-guest-form">
            <div className="form-group">
              <label>Имя гостя:</label>
              <input
                type="text"
                value={newGuest.name}
                onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                placeholder="Введите имя гостя"
              />
            </div>
            <div className="form-group">
              <label>Email гостя:</label>
              <input
                type="email"
                value={newGuest.email}
                onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                placeholder="Введите email гостя"
              />
            </div>
            <button type="submit" className="btn-primary">
              Добавить гостя
            </button>
          </form>

          <div className="guests-list">
            {editedEvent.guests.map(guest => (
              <div key={guest.id} className="guest-item">
                <div className="guest-info">
                  <span className="guest-name">{guest.name}</span>
                  <span className="guest-email">{guest.email}</span>
                </div>
                <button
                  onClick={() => removeGuest(guest.id)}
                  className="btn-danger btn-sm"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="tasks-section">
          <form onSubmit={addTask} className="add-task-form">
            <div className="form-group">
              <label>Новая задача:</label>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Введите текст задачи"
              />
            </div>
            <button type="submit" className="btn-primary">
              Добавить задачу
            </button>
          </form>

          <div className="tasks-list">
            {editedEvent.tasks.map(task => (
              <div key={task.id} className="task-item">
                <label className="task-label">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span className={task.completed ? 'completed-task' : ''}>
                    {task.text}
                  </span>
                </label>
                <button
                  onClick={() => removeTask(task.id)}
                  className="btn-danger btn-sm"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'budget' && (
        <div className="budget-section">
          <div className="budget-summary">
            <div className="form-group">
              <label>Планируемый бюджет:</label>
              <input
                type="number"
                value={editedEvent.budget.planned === 0 ? '' : editedEvent.budget.planned}
                onChange={(e) => {
                  const value = e.target.value;
                  setEditedEvent({
                    ...editedEvent,
                    budget: { 
                      ...editedEvent.budget, 
                      planned: value === '' ? 0 : Number(value)
                    }
                  });
                }}
                onBlur={(e) => {
                  if (e.target.value === '') {
                    setEditedEvent({
                      ...editedEvent,
                      budget: { 
                        ...editedEvent.budget, 
                        planned: 0
                      }
                    });
                  }
                }}
                placeholder="Введите сумму"
                min="0"
              />
            </div>
            <div className="budget-total">
              <span>Потрачено: {calculateTotalSpent()} ₽</span>
              <span className={calculateTotalSpent() > editedEvent.budget.planned ? 'overspent' : ''}>
                Осталось: {editedEvent.budget.planned - calculateTotalSpent()} ₽
              </span>
            </div>
          </div>

          <form onSubmit={addBudgetItem} className="add-budget-item-form">
            <div className="form-group">
              <label>Описание расхода:</label>
              <input
                type="text"
                value={newBudgetItem.description}
                onChange={(e) => setNewBudgetItem({ ...newBudgetItem, description: e.target.value })}
                placeholder="Введите описание расхода"
              />
            </div>
            <div className="form-group">
              <label>Сумма:</label>
              <input
                type="number"
                value={newBudgetItem.amount}
                onChange={(e) => setNewBudgetItem({ ...newBudgetItem, amount: e.target.value })}
                placeholder="Введите сумму"
                min="0"
              />
            </div>
            <button type="submit" className="btn-primary">
              Добавить расход
            </button>
          </form>

          <div className="budget-items-list">
            {editedEvent.budget.items.map(item => (
              <div key={item.id} className="budget-item">
                <div className="budget-item-info">
                  <span className="budget-item-description">{item.description}</span>
                  <span className="budget-item-amount">{item.amount} ₽</span>
                </div>
                <button
                  onClick={() => removeBudgetItem(item.id)}
                  className="btn-danger btn-sm"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 