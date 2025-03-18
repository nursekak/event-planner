import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, eventTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <svg className="modal-icon" viewBox="0 0 24 24" width="48" height="48">
            <path fill="#dc2626" d="M12 4c-4.419 0-8 3.582-8 8s3.581 8 8 8s8-3.582 8-8s-3.581-8-8-8zm3.707 10.293c.391.391.391 1.023 0 1.414c-.195.195-.451.293-.707.293s-.512-.098-.707-.293L12 13.414l-2.293 2.293c-.195.195-.451.293-.707.293s-.512-.098-.707-.293c-.391-.391-.391-1.023 0-1.414L10.586 12L8.293 9.707c-.391-.391-.391-1.023 0-1.414s1.023-.391 1.414 0L12 10.586l2.293-2.293c.391-.391 1.023-.391 1.414 0s.391 1.023 0 1.414L13.414 12l2.293 2.293z"/>
          </svg>
          <h3>Удаление мероприятия</h3>
          <p>
            Вы действительно хотите удалить мероприятие
            <br />
            <strong>"{eventTitle}"</strong>?
          </p>
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Отмена
          </button>
          <button className="btn-delete" onClick={onConfirm}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 