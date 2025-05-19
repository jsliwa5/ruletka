import React from 'react';
import '../styles/BetPanel.css';

const numberColorMap = {
  red: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
  black: [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
};

const getColor = (num) => {
  if (numberColorMap.red.includes(num)) return 'red';
  if (numberColorMap.black.includes(num)) return 'black';
  return '';
};

const BetPanel = ({ onBetSelect, selectedBet }) => {
  const renderNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= 36; i++) {
      const color = getColor(i);
      numbers.push(
        <div
          key={i}
          className={`bet-cell number ${color} ${
            selectedBet?.type === 'number' && selectedBet.value === i ? 'selected' : ''
          }`}
          onClick={() => onBetSelect({ type: 'number', value: i })}
        >
          {i}
        </div>
      );
    }
    return numbers;
  };

  const renderSpecialBets = () => {
    const special = [
      { label: 'Red', type: 'color', value: 'red' },
      { label: 'Black', type: 'color', value: 'black' },
      { label: 'Even', type: 'parity', value: 'even' },
      { label: 'Odd', type: 'parity', value: 'odd' },
      { label: '1st 12', type: 'dozen', value: '1-12' },
      { label: '2nd 12', type: 'dozen', value: '13-24' },
      { label: '3rd 12', type: 'dozen', value: '25-36' },
    ];

    return special.map((bet) => (
      <button
        key={bet.label}
        className={`bet-button ${
          selectedBet?.type === bet.type && selectedBet.value === bet.value ? 'selected' : ''
        }`}
        onClick={() => onBetSelect(bet)}
      >
        {bet.label}
      </button>
    ));
  };

  return (
    <div className="bet-panel">
      <h3>Wybierz zakład</h3>
      <div className="number-grid">{renderNumbers()}</div>
      <div className="special-bets">{renderSpecialBets()}</div>
    </div>
  );
};

export default BetPanel;
