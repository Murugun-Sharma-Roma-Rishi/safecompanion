import React, { useState } from 'react';

const SECRET_PIN = '1234'; // ← Change this to your PIN

export default function Calculator({ onUnlock }) {
  const [display, setDisplay] = useState('0');
  const [input, setInput] = useState('');

  const handle = (val) => {
    if (val === 'C') { setDisplay('0'); setInput(''); return; }
    if (val === '=') {
      if (input === SECRET_PIN) { onUnlock(); return; }
      try {
        // eslint-disable-next-line no-eval
        const r = eval(input);
        setDisplay(String(r)); setInput('');
      } catch { setDisplay('Error'); setInput(''); }
      return;
    }
    const next = input + val;
    setInput(next);
    setDisplay(next);
  };

  const rows = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '−'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  const opMap = { '÷': '/', '×': '*', '−': '-' };

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: 16,
    }}>
      {/* Display */}
      <div style={{
        color: '#fff',
        fontSize: display.length > 9 ? 36 : 60,
        fontWeight: 200,
        textAlign: 'right',
        padding: '0 8px 20px',
        letterSpacing: -2,
      }}>
        {display}
      </div>

      {/* Buttons */}
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          {row.map(btn => {
            const isOp = ['÷', '×', '−', '+', '='].includes(btn);
            const isTop = ['C', '±', '%'].includes(btn);
            const isZero = btn === '0';
            return (
              <button
                key={btn}
                onClick={() => handle(opMap[btn] || btn)}
                style={{
                  flex: isZero ? 2 : 1,
                  height: 76,
                  borderRadius: 50,
                  border: 'none',
                  fontSize: 30,
                  fontWeight: isOp ? 400 : 300,
                  cursor: 'pointer',
                  background: isOp ? '#ff9f0a' : isTop ? '#d4d4d2' : '#333',
                  color: isTop ? '#000' : '#fff',
                  textAlign: isZero ? 'left' : 'center',
                  paddingLeft: isZero ? 28 : 0,
                  transition: 'opacity 0.1s',
                }}
                onMouseDown={e => e.currentTarget.style.opacity = '0.7'}
                onMouseUp={e => e.currentTarget.style.opacity = '1'}
                onTouchStart={e => e.currentTarget.style.opacity = '0.7'}
                onTouchEnd={e => e.currentTarget.style.opacity = '1'}
              >
                {btn}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}