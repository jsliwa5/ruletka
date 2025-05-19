import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LogoutButton.css';

const LogoutButton = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Błąd podczas wylogowywania');
      }

      // Po udanym wylogowaniu przekieruj na stronę logowania
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="logout-button-container">
      <button className="logout-button" onClick={handleLogout}>Wyloguj się</button>
    </div>
  );
};

export default LogoutButton;
