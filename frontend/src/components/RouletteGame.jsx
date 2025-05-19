import React, { useState, useRef, useEffect } from 'react';
import Roulette from './Roulette';
import BetPanel from './BetPanel';
import LogoutButton from './LogoutButton'; // ✅ DODANE
import TopUpPanel from './TopUpPanel';     // ✅ DODANE
import '../styles/RouletteGame.css';

const RouletteGame = ({ initialBalance, onBalanceChange, fetchBalance }) => {
  const [balance, setBalance] = useState(initialBalance);
  const balanceRef = useRef(initialBalance);

  useEffect(() => {
    if (fetchBalance) {
      fetchBalance();
    }
  }, [fetchBalance]);

  useEffect(() => {
    if (typeof initialBalance === 'number' && Number.isFinite(initialBalance)) {
      setBalance(initialBalance);
      balanceRef.current = initialBalance;
    } else if (initialBalance === null) {
      setBalance(null);
      balanceRef.current = null;
    }
  }, [initialBalance]);

  const [betAmount, setBetAmount] = useState(100);
  const [selectedBet, setSelectedBet] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [message, setMessage] = useState('');
  const [canSpin, setCanSpin] = useState(true);

  const handleManualTopUp = (newBalance) => {
    setBalance(newBalance);
    balanceRef.current = newBalance;
  };

  const handleBet = () => {
    if (!selectedBet) {
      setMessage('Wybierz zakład.');
      return false;
    }

    if (balanceRef.current === null) {
      setMessage('Saldo jest ładowane, spróbuj za chwilę.');
      return false;
    }

    if (betAmount <= 0 || betAmount > balanceRef.current) {
      setMessage('Nieprawidłowa kwota zakładu.');
      return false;
    }

    const newBalance = balanceRef.current - betAmount;
    balanceRef.current = newBalance;
    setBalance(newBalance);
    setMessage('');
    setCanSpin(false);
    return true;
  };

  const handleSpinEnd = (result) => {
    setLastResult(result);

    let win = false;
    const resultNumber = parseInt(result.number, 10);
    const resultColor = result.color;

    switch (selectedBet.type) {
      case 'number': win = resultNumber === selectedBet.value; break;
      case 'color': win = resultColor === selectedBet.value; break;
      case 'parity':
        if (resultNumber !== 0) {
          win = (resultNumber % 2 === 0 && selectedBet.value === 'even') ||
                (resultNumber % 2 !== 0 && selectedBet.value === 'odd');
        }
        break;
      case 'dozen':
        const [min, max] = selectedBet.value.split('-').map(Number);
        win = resultNumber >= min && resultNumber <= max;
        break;
      default: break;
    }

    let payout = 0;
    if (win) {
      switch (selectedBet.type) {
        case 'number': payout = betAmount * 36; break;
        case 'color':
        case 'parity': payout = betAmount * 2; break;
        case 'dozen': payout = betAmount * 3; break;
        default: break;
      }

      const newBalanceAfterWin = balanceRef.current + payout;
      balanceRef.current = newBalanceAfterWin;
      setBalance(newBalanceAfterWin);

      if (onBalanceChange) {
        onBalanceChange(newBalanceAfterWin, betAmount, selectedBet.type, selectedBet.value, 'win', payout);
      }
      setMessage(`✅ Wygrana! ${result.number} (${result.color}) → +${payout} żetonów`);
    } else {
      if (onBalanceChange) {
        onBalanceChange(balanceRef.current, betAmount, selectedBet.type, selectedBet.value, 'lose', 0);
      }
      setMessage(`❌ Przegrana! ${result.number} (${result.color}) → -${betAmount} żetonów`);
    }
    setCanSpin(true);
  };

  return (
    <div className="roulette-game-layout">
      <div className="roulette-left">
        <Roulette
          onSpinEnd={handleSpinEnd}
          baseSize={400}
          spinRequest={canSpin ? handleBet : null}
        />
      </div>

      <div className="roulette-right">
        {/* ✅ Nowe przyciski */}
        <TopUpPanel onBalanceUpdate={handleManualTopUp} />
        <LogoutButton />

        <div className="roulette-bet-panel">
          <BetPanel
            onBetSelect={setSelectedBet}
            selectedBet={selectedBet}
          />
          <label>
            Kwota zakładu:&nbsp;
            <input
              type="number"
              value={betAmount}
              min="1"
              max={balance === null ? 1 : balance}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              disabled={!canSpin || balance === null}
            />
          </label>
        </div>

        <div className="roulette-info-panel">
          <p><strong>Saldo:</strong> {balance === null ? 'Ładowanie...' : `${balance} żetonów`}</p>
          {lastResult && (
            <p><strong>Ostatni wynik:</strong> {lastResult.number} ({lastResult.color})</p>
          )}
          {message && <p><strong>{message}</strong></p>}
        </div>
      </div>
    </div>
  );
};

export default RouletteGame;
