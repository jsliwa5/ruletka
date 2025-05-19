import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Funkcja pomocnicza do pobrania CSRF tokena z ciasteczek
const getCSRFToken = () => {
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return decodeURIComponent(value);
  }
  return null;
};

// Usunięto prop fetchBalance, ponieważ nie będzie już tutaj używany
const Login = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('initial');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '', confirm_password: '' });
  const [loginResult, setLoginResult] = useState('');

  // Pobieramy CSRF token na starcie (zakomentowane, zgodnie z oryginalnym kodem)
  // useEffect(() => {
  //   fetch('http://localhost:8000/api/csrf/', { credentials: 'include' });
  // }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Usuń X-CSRFToken jeśli endpoint jest csrf_exempt
          // 'X-CSRFToken': getCSRFToken(),
        },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });

      // Nie potrzebujemy już tutaj danych z odpowiedzi logowania do obsługi salda
      // const data = await response.json(); 

      if (response.ok) {
        // Usunięto wywołanie fetchBalance();
        // setLoginResult(`Zalogowano!`); // Można ustawić ogólny komunikat sukcesu logowania
        navigate('/roulette'); // Przekierowanie do ruletki, RouletteGame.jsx pobierze saldo
      } else {
        // const errorData = await response.json(); // Aby uzyskać szczegóły błędu z serwera
        setLoginResult('Błąd logowania: nieprawidłowe dane');
      }
    } catch (error) {
      console.log('Błąd logowania:', error);
      setLoginResult('Błąd sieci lub serwera');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Prosta walidacja frontendowa przed wysłaniem
    if (registerData.password !== registerData.confirm_password) {
      setLoginResult('Hasła nie są takie same.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // jeśli endpoint nie jest csrf_exempt, dodaj CSRF token
          // 'X-CSRFToken': getCSRFToken(),
        },
        credentials: 'include',
        body: JSON.stringify({
          username: registerData.username,
          password1: registerData.password,
          password2: registerData.confirm_password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setView('login');
        setLoginResult('✅ Rejestracja zakończona. Możesz się teraz zalogować.');
      } else {
        const errors = Object.entries(result.errors || {})
          .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
          .join(' | ');
        setLoginResult(`❌ Błąd rejestracji: ${errors}`);
      }
    } catch (error) {
      console.error('Błąd rejestracji:', error);
      setLoginResult('Błąd sieci lub serwera przy rejestracji.');
    }
  };

  const renderInitialView = () => (
    <div id="initial-view">
      <h2>Dołącz do nas</h2>
      <div className="button-group">
        <button className="action-button" onClick={() => setView('login')}>Logowanie</button>
        <button className="action-button" onClick={() => setView('register')}>Rejestracja</button>
      </div>
    </div>
  );

  const renderLoginForm = () => (
    <div className="form-container">
      <button className="back-button" onClick={() => setView('initial')}>&larr;</button>
      <form onSubmit={handleLoginSubmit}>
        <h2>Logowanie</h2>
        <div className="form-group">
          <label>Nazwa użytkownika:</label>
          <input
            type="text"
            value={loginData.username}
            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Hasło:</label>
          <input
            type="password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="submit-button">Zaloguj się</button>
        {loginResult && <p>{loginResult}</p>}
      </form>
    </div>
  );

  const renderRegisterForm = () => (
    <div className="form-container">
      <button className="back-button" onClick={() => setView('initial')}>&larr;</button>
      <form onSubmit={handleRegisterSubmit}>
        <h2>Rejestracja</h2>
        <div className="form-group">
          <label>Nazwa użytkownika:</label>
          <input
            type="text"
            value={registerData.username}
            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Hasło:</label>
          <input
            type="password"
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Potwierdź hasło:</label>
          <input
            type="password"
            value={registerData.confirm_password}
            onChange={(e) => setRegisterData({ ...registerData, confirm_password: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="submit-button">Zarejestruj się</button>
      </form>
    </div>
  );

  return (
    <div className="split-container">
      <div className="left-pane">
        <h1>Witamy w kasynie online!</h1>
        <p>Zaloguj się lub zarejestruj, aby kontynuować.</p>
      </div>
      <div className="right-pane">
        {view === 'initial' && renderInitialView()}
        {view === 'login' && renderLoginForm()}
        {view === 'register' && renderRegisterForm()}
      </div>
    </div>
  );
};

export default Login;