import React from 'react';
import '../styles/LogoutButton.css';

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await fetch('/api/logout/', {
        method: 'POST',
        credentials: 'include',
      });
      window.location.href = '/';
    } catch (error) {
      console.error('Błąd wylogowania:', error);
    }
  };

  return (
    <div className="logout-button-container">
      <button className="logout-button" onClick={handleLogout}>Wyloguj się</button>
    </div>
  );
};

export default LogoutButton;
