import { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const Chat = ({ currentUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.get('/api/messages/chats');
        setConversations(response.data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
    // Обновляем список бесед каждые 30 секунд
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          const response = await api.get(`/api/messages/conversation/${selectedConversation.id}`);
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
      // Обновляем сообщения каждые 5 секунд
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users');
      // Фильтруем текущего пользователя из списка
      setUsers(response.data.filter(user => user.id !== currentUser.id));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateChat = async () => {
    if (!selectedUser) return;

    try {
      const response = await api.post('/api/messages/create-chat', {
        userId: selectedUser.id
      });
      
      // Проверяем, что ответ содержит данные и ID новой беседы
      if (response.data && response.data.id) {
        const newConversation = response.data;
        setConversations(prevConversations => {
          // Проверяем, нет ли уже такой беседы в списке
          if (!prevConversations.some(conv => conv.id === newConversation.id)) {
            return [...prevConversations, newConversation];
          }
          return prevConversations;
        });
        setSelectedConversation(newConversation); // Сразу переключаемся на новую беседу
        setIsCreatingChat(false); // Закрываем режим создания
        setSelectedUser(null); // Сбрасываем выбор пользователя
        setSearchQuery(''); // Очищаем поиск пользователей
        alert('Беседа успешно создана!'); // Уведомление для пользователя
      } else {
        console.error('Failed to create chat: Invalid response data', response);
        alert('Не удалось создать беседу: неверные данные ответа.');
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      // Добавляем вывод сообщения об ошибке для пользователя
      alert(`Ошибка при создании беседы: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleStartCreating = () => {
    setIsCreatingChat(true);
    fetchUsers();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !isFileUploading) return;

    try {
      const response = await api.post('/api/messages/send', {
        content: newMessage,
        receiverId: selectedConversation.id,
        senderId: currentUser.id
      });
      setMessages([...messages, response.data]);
      setNewMessage('');
      setIsEmojiPickerOpen(false);
    } catch (error) {
      console.error('Error sending message:', error);
      // Добавляем alert для отображения ошибки пользователю
      alert(`Ошибка при отправке сообщения: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsFileUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('receiverId', selectedConversation.id);

    try {
      const response = await api.post('/api/messages/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(progress);
        }
      });
      setMessages([...messages, response.data]);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsFileUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await api.delete(`/api/messages/${messageId}`);
      setMessages(messages.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMessages = messages.filter(msg =>
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="chat-overlay" onClick={onClose} />
      <div className="chat-container">
        <div className="chat-sidebar">
          <div className="chat-header">
            <div className="header-content">
              <h3>{isCreatingChat ? 'Новая беседа' : 'Сообщения'}</h3>
              <button onClick={onClose} className="close-btn">×</button>
            </div>
          </div>
          
          {isCreatingChat ? (
            <>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Поиск пользователей..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="users-list">
                {users
                  .filter(user => 
                    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(user => (
                    <div
                      key={user.id}
                      className={`user-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="user-avatar">
                        {user.photo && <img src={user.photo} alt={user.name} />}
                      </div>
                      <div className="user-info">
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                  ))}
              </div>
              <button 
                className="new-chat-button"
                onClick={handleCreateChat}
                disabled={!selectedUser}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                </svg>
                Создать беседу
              </button>
            </>
          ) : (
            <>
              <button className="new-chat-button" onClick={handleStartCreating}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                </svg>
                Новая беседа
              </button>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Поиск по беседам..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="conversations-list">
                {filteredConversations.length === 0 ? (
                  <div className="no-conversations">
                    <p>Нет доступных бесед</p>
                  </div>
                ) : (
                  filteredConversations.map(conv => (
                    <div
                      key={conv.id}
                      className={`conversation-item ${selectedConversation?.id === conv.id ? 'selected' : ''}`}
                      onClick={() => setSelectedConversation(conv)}
                    >
                      <div className="conversation-avatar">
                        {conv.photo && <img src={conv.photo} alt={conv.name} />}
                        <span className={`online-status ${conv.isOnline ? 'online' : 'offline'}`} />
                      </div>
                      <div className="conversation-info">
                        <div className="conversation-name">{conv.name}</div>
                        <div className="conversation-preview">{conv.lastMessage}</div>
                        {conv.unreadCount > 0 && (
                          <span className="unread-badge">{conv.unreadCount}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
        <div className="chat-main">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <div className="chat-user-info">
                  <div className="user-avatar">
                    {selectedConversation.photo && (
                      <img src={selectedConversation.photo} alt={selectedConversation.name} />
                    )}
                    <span className={`online-status ${selectedConversation.isOnline ? 'online' : 'offline'}`} />
                  </div>
                  <div>
                    <h3>{selectedConversation.name}</h3>
                    <span className="user-status">
                      {selectedConversation.isOnline ? 'В сети' : 'Не в сети'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="messages-container">
                {filteredMessages.length === 0 ? (
                  <div className="no-messages">
                    <p>Нет сообщений в этой беседе.</p>
                  </div>
                ) : (
                  filteredMessages.map(msg => {
                    const isSent = msg.senderId === currentUser.id;
                    return (
                      <div 
                        key={msg.id} 
                        className={`message ${isSent ? 'sent' : 'received'}`}
                        onDoubleClick={() => handleDeleteMessage(msg.id)}
                      >
                        {msg.content}
                        <div className="message-meta">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              <form className="message-input" onSubmit={handleSendMessage}>
                <div className="input-actions">
                  <button
                    type="button"
                    className="emoji-btn"
                    onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                  >
                    😊
                  </button>
                  <button
                    type="button"
                    className="file-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📎
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Напишите сообщение..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                {isFileUploading && (
                  <div className="upload-progress">
                    <div
                      className="progress-bar"
                      style={{ width: `${uploadProgress}%` }}
                    />
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                )}
                <button type="submit" className="send-button" disabled={!newMessage.trim() && !isFileUploading}>
                  ➤
                </button>
              </form>
            </>
          ) : (
            <div className="no-conversation">
              <p>Выберите чат для начала общения</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat; 