import { useState } from 'react';

export default function CreateEvent({ onSave, onCancel }) {
  const [event, setEvent] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...event,
      date: new Date(`${event.date}T${event.time}`).toISOString()
    });
  };

  return (
    <div className="create-event">
      <h2>Создание события</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Название:</label>
          <input
            type="text"
            value={event.title}
            onChange={(e) => setEvent({ ...event, title: e.target.value })}
            placeholder="Введите название события"
            required
          />
        </div>

        <div className="form-group">
          <label>Описание:</label>
          <textarea
            value={event.description}
            onChange={(e) => setEvent({ ...event, description: e.target.value })}
            placeholder="Введите описание события"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Дата:</label>
          <input
            type="date"
            value={event.date}
            onChange={(e) => setEvent({ ...event, date: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group">
          <label>Время:</label>
          <input
            type="time"
            value={event.time}
            onChange={(e) => setEvent({ ...event, time: e.target.value })}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Создать
          </button>
          <button type="button" onClick={onCancel} className="btn-outline">
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
} 