import React, { useState } from 'react';
import '../styles/TopUpPanel.css';

const TopUpPanel = ({ onTopUp }) => {
  const [show, setShow] = useState(false);
  const [amount, setAmount] = useState(100);

  const handleSubmit = () => {
    if (amount > 0) {
      onTopUp(amount);
      setShow(false);
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
          />
          <button onClick={handleSubmit}>Dodaj</button>
        </>
      )}
    </div>
  );
};

export default TopUpPanel;
