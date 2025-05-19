import React, { useState } from 'react';
import '../styles/TopUpPanel.css';

const TopUpPanel = ({ onBalanceUpdate }) => {
  const [show, setShow] = useState(false);
  const [amount, setAmount] = useState(100);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTopUp = async () => {
    setError(null);

    if (amount <= 0) {
      setError('Kwota musi być większa od zera.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/add-funds/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Błąd dodawania środków');
      }

      // Zaktualizuj saldo w głównym komponencie
      if (onBalanceUpdate) {
        onBalanceUpdate(data.new_balance);
      }

      setShow(false);
      setAmount(100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="topup-container">
      <button onClick={() => setShow(!show)}>
        {show ? 'Ukryj dodawanie żetonów' : 'Dodaj żetony'}
      </button>

      {show && (
        <>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            disabled={loading}
          />
          <button onClick={handleTopUp} disabled={loading}>
            {loading ? 'Dodawanie...' : 'Dodaj'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      )}
    </div>
  );
};

export default TopUpPanel;
