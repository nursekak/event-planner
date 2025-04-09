import { useState, useRef, useEffect } from 'react';

const ProfileMenu = ({ currentUser, onProfileClick, onSignOut, onSettingsClick, onChatClick, onMyEventsClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const updateDropdownPosition = () => {
      if (buttonRef.current && isOpen) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', updateDropdownPosition);
    window.addEventListener('resize', updateDropdownPosition);

    if (isOpen) {
      updateDropdownPosition();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updateDropdownPosition);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [isOpen]);

  return (
    <div className="profile-menu-container" ref={menuRef}>
      <button 
        ref={buttonRef}
        className="profile-menu-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentUser?.photo && (
          <img 
            src={currentUser.photo} 
            alt="Avatar" 
            className="profile-menu-avatar"
          />
        )}
        <span>{currentUser?.name || 'Профиль'}</span>
        <svg 
          className={`profile-menu-arrow ${isOpen ? 'open' : ''}`}
          width="12" 
          height="12" 
          viewBox="0 0 12 12"
        >
          <path 
            d="M2 4L6 8L10 4" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            fill="none"
          />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="profile-dropdown"
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`
          }}
        >
          <button onClick={() => {
            onProfileClick();
            setIsOpen(false);
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z" fill="currentColor"/>
            </svg>
            <span>Мой профиль</span>
          </button>
          
          <button onClick={() => {
            onMyEventsClick();
            setIsOpen(false);
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.3337 2.66667H2.66699C1.93061 2.66667 1.33366 3.26362 1.33366 4V13.3333C1.33366 14.0697 1.93061 14.6667 2.66699 14.6667H13.3337C14.07 14.6667 14.667 14.0697 14.667 13.3333V4C14.667 3.26362 14.07 2.66667 13.3337 2.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.6663 1.33333V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.33366 1.33333V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1.33366 6.66667H14.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.66699 9.33333H6.00033" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.66699 12H7.33366" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.33366 9.33333H11.3337" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.33366 12H11.3337" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Мои мероприятия</span>
          </button>
          
          <button onClick={() => {
            onSettingsClick();
            setIsOpen(false);
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.3 7.3L12 6.9C11.9 6.5 11.7 6.2 11.5 5.9L12 4.6C12.1 4.4 12 4.2 11.8 4L11 3.2C10.8 3 10.6 2.9 10.4 3L9.1 3.5C8.8 3.3 8.5 3.1 8.1 3L7.7 1.7C7.7 1.4 7.5 1.3 7.2 1.3H6.2C5.9 1.3 5.7 1.4 5.7 1.7L5.3 3C4.9 3.1 4.6 3.3 4.3 3.5L3 3C2.8 2.9 2.6 3 2.4 3.2L1.6 4C1.4 4.2 1.3 4.4 1.4 4.6L1.9 5.9C1.7 6.2 1.5 6.5 1.4 6.9L0.1 7.3C-0.1 7.3 -0.2 7.5 -0.2 7.8V8.8C-0.2 9.1 -0.1 9.3 0.1 9.3L1.4 9.7C1.5 10.1 1.7 10.4 1.9 10.7L1.4 12C1.3 12.2 1.4 12.4 1.6 12.6L2.4 13.4C2.6 13.6 2.8 13.7 3 13.6L4.3 13.1C4.6 13.3 4.9 13.5 5.3 13.6L5.7 14.9C5.7 15.2 5.9 15.3 6.2 15.3H7.2C7.5 15.3 7.7 15.2 7.7 14.9L8.1 13.6C8.5 13.5 8.8 13.3 9.1 13.1L10.4 13.6C10.6 13.7 10.8 13.6 11 13.4L11.8 12.6C12 12.4 12.1 12.2 12 12L11.5 10.7C11.7 10.4 11.9 10.1 12 9.7L13.3 9.3C13.5 9.3 13.6 9.1 13.6 8.8V7.8C13.6 7.5 13.5 7.3 13.3 7.3ZM6.7 10.7C5.2 10.7 4 9.5 4 8C4 6.5 5.2 5.3 6.7 5.3C8.2 5.3 9.4 6.5 9.4 8C9.4 9.5 8.2 10.7 6.7 10.7Z" fill="currentColor"/>
            </svg>
            <span>Настройки</span>
          </button>

          <button onClick={() => {
            onChatClick();
            setIsOpen(false);
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 0C3.58 0 0 3.58 0 8C0 9.85 0.63 11.55 1.69 12.9L0.5 15.5L3.1 14.31C4.45 15.37 6.15 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM8 14C6.66 14 5.34 13.65 4.2 13L1.2 13.8L2 10.8C1.35 9.66 1 8.34 1 7C1 3.14 4.14 0 8 0C11.86 0 15 3.14 15 7C15 10.86 11.86 14 8 14Z" fill="currentColor"/>
              <path d="M4.5 7.5C4.5 7.78 4.72 8 5 8H11C11.28 8 11.5 7.78 11.5 7.5C11.5 7.22 11.28 7 11 7H5C4.72 7 4.5 7.22 4.5 7.5ZM5 10H11C11.28 10 11.5 9.78 11.5 9.5C11.5 9.22 11.28 9 11 9H5C4.72 9 4.5 9.22 4.5 9.5C4.5 9.78 4.72 10 5 10Z" fill="currentColor"/>
            </svg>
            <span>Сообщения</span>
          </button>

          <button onClick={() => {
            onSignOut();
            setIsOpen(false);
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6.4 14H3.2C2.88174 14 2.57652 13.8736 2.35147 13.6485C2.12643 13.4235 2 13.1183 2 12.8V3.2C2 2.88174 2.12643 2.57652 2.35147 2.35147C2.57652 2.12643 2.88174 2 3.2 2H6.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.4 11.2L14 8L10.4 4.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 8H6.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Выйти</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu; 