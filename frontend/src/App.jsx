import React, { useState, useCallback } from 'react'; // Dodaj useCallback
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import RouletteGame from './components/RouletteGame';
import RequireAuth from './components/RequireAuth';

function App() {
  const [userBalance, setUserBalance] = useState(null);

  const fetchBalance = useCallback(async () => { // Użyj useCallback
    try {
      const response = await fetch('http://localhost:8000/api/get-balance/', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUserBalance(Number(data.balance));
      } else {
        console.error('Nie udało się pobrać balansu.');
        // setUserBalance(null); // Opcjonalnie: ustaw na null w przypadku błędu
      }
    } catch (err) {
      console.error('Błąd podczas pobierania balansu:', err);
      // setUserBalance(null); // Opcjonalnie: ustaw na null w przypadku błędu
    }
  }, []); // Pusta tablica zależności, funkcja zostanie stworzona raz

  const updateBalance = useCallback(async (newBalance, amount, betType, betValue, result, payout) => { // Użyj useCallback
    try {
      const response = await fetch('http://localhost:8000/api/update-balance/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          balance: newBalance,
          bet_type: betType,
          bet_value: betValue,
          result,
          payout,
        }),
      });

      if (response.ok) {
        setUserBalance(newBalance);
      } else {
        console.error('Błąd przy aktualizacji salda.');
        // Rozważ refetch balansu lub cofnięcie optymistycznej aktualizacji
      }
    } catch (err) {
      console.error('Network error przy aktualizacji salda:', err);
    }
  }, []); // Pusta tablica zależności

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/roulette"
          element={
            <RequireAuth>
              <RouletteGame
                onBalanceChange={updateBalance}
                initialBalance={userBalance} 
                fetchBalance={fetchBalance}   
              />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;