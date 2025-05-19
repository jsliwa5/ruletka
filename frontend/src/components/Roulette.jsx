import React, { useState, useRef, useEffect } from 'react';
import '../styles/Roulette.css';

const europeanRouletteLayout = [
  { number: '0', color: 'green' }, { number: '32', color: 'red' }, { number: '15', color: 'black' },
  { number: '19', color: 'red' }, { number: '4', color: 'black' }, { number: '21', color: 'red' },
  { number: '2', color: 'black' }, { number: '25', color: 'red' }, { number: '17', color: 'black' },
  { number: '34', color: 'red' }, { number: '6', color: 'black' }, { number: '27', color: 'red' },
  { number: '13', color: 'black' }, { number: '36', color: 'red' }, { number: '11', color: 'black' },
  { number: '30', color: 'red' }, { number: '8', color: 'black' }, { number: '23', color: 'red' },
  { number: '10', color: 'black' }, { number: '5', color: 'red' }, { number: '24', color: 'black' },
  { number: '16', color: 'red' }, { number: '33', color: 'black' }, { number: '1', color: 'red' },
  { number: '20', color: 'black' }, { number: '14', color: 'red' }, { number: '31', color: 'black' },
  { number: '9', color: 'red' }, { number: '22', color: 'black' }, { number: '18', color: 'red' },
  { number: '29', color: 'black' }, { number: '7', color: 'red' }, { number: '28', color: 'black' },
  { number: '12', color: 'red' }, { number: '35', color: 'black' }, { number: '3', color: 'red' },
  { number: '26', color: 'black' }
];

const colorMap = {
  red: '#D92626',
  black: '#333',
  green: '#008000'
};

const degToRad = (deg) => (deg * Math.PI) / 180;

const Roulette = ({
  baseSize = 350,
  onSpinEnd,
  onBetResolve,
  currentBets = { red: 0, black: 0, green: 0 },
  spinRequest }) => {
    
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef(null);
  const targetRotationRef = useRef(0);

  const options = europeanRouletteLayout;
  const numOptions = options.length;
  const arcSize = 360 / numOptions;
  const spinDuration = 5000;

  const handleSpin = async () => {
    if (isSpinning || numOptions === 0) return;

    if (spinRequest && typeof spinRequest === 'function') {
      const allowed = await spinRequest(); // ważne!
      if (!allowed) return; // przerwij jeśli zakład nie przeszedł walidacji
    }

    setIsSpinning(true);
    setResult(null);

    const baseRotations = 6 * 360;
    const randomExtraDegrees = Math.random() * 360;

    targetRotationRef.current += baseRotations + randomExtraDegrees;
    setRotation(targetRotationRef.current);

    setTimeout(() => {
      const normalizedAngle = (360 - (targetRotationRef.current % 360)) % 360;
      const winningIndex = Math.floor(normalizedAngle / arcSize);
      const winningOption = options[winningIndex];

      setResult(winningOption);
      setIsSpinning(false);

      if (onSpinEnd) onSpinEnd(winningOption);
      if (onBetResolve) onBetResolve(winningOption.color);
    }, spinDuration);
  };

  const getConicGradient = () => {
    return `conic-gradient(from 0deg, ${options
      .map((option, i) => {
        const startAngle = i * arcSize;
        const endAngle = startAngle + arcSize;
        const color = colorMap[option.color] || '#ccc';
        return `${color} ${startAngle}deg ${endAngle}deg`;
      })
      .join(', ')})`;
  };

  const wheelStyle = {
    width: `${baseSize}px`,
    height: `${baseSize}px`,
    background: getConicGradient(),
    transform: `rotate(${rotation}deg)`,
    transition: `transform ${spinDuration}ms cubic-bezier(0.1, 0.7, 0.1, 1)`,
  };

  const getLabelPosition = (index) => {
    const angleDeg = index * arcSize + arcSize / 2;
    const angleRad = degToRad(angleDeg);
    const radius = baseSize * 0.42;
    const x = Math.sin(angleRad) * radius;
    const y = -Math.cos(angleRad) * radius;
    const labelRotation = -angleDeg;

    return {
      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${labelRotation}deg)`,
    };
  };

  return (
    <div className="roulette-container classic" style={{ width: `${baseSize}px` }}>
      <div className="roulette-pointer classic-pointer"></div>
      <div className="roulette-wheel-wrapper classic-wrapper">
        <div className="roulette-outer-ring"></div>
        <div className="roulette-center-piece"></div>
        <div
          ref={wheelRef}
          className="roulette-wheel classic-wheel"
          style={wheelStyle}
        >
          {options.map((option, index) => (
            <div
              key={index}
              className="roulette-label classic-label"
              style={getLabelPosition(index)}
            >
              {option.number}
            </div>
          ))}
        </div>
      </div>

      <button
        className="spin-button classic-button"
        onClick={handleSpin}
        disabled={isSpinning}
      >
        {isSpinning ? 'Kręci...' : 'Zakręć!'}
      </button>

      {result && !isSpinning && (
        <div className={`result-display classic-result ${result.color}`}>
          Wynik: <span className="result-number">{result.number}</span> ({result.color})
        </div>
      )}
    </div>
  );
};

export default Roulette;
