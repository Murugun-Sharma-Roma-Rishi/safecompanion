import React, { useState } from 'react';

// Secret PIN to unlock the real app (change this to whatever you want)
const SECRET_PIN = '1234';

export default function Calculator({ onUnlock }) {
  const [display, setDisplay] = useState('0');
  const [input, setInput] = useState('');

  const handleButton = (value) => {
    if (value === 'C') {
      setDisplay('0');
      setInput('');
      return;
    }

    if (value === '=') {
      // Check if the input matches the secret PIN
      if (input === SECRET_PIN) {
        onUnlock(); // Open real app!
        return;
      }
      // Normal calculator: evaluate expression
      try {
        // eslint-disable-next-line no-eval
        const result = eval(input);
        setDisplay(String(result));
        setInput('');
      } catch {
        setDisplay('Error');
        setInput('');
      }
      return;
    }

    const newInput = input + value;
    setInput(newInput);
    setDisplay(newInput);
  };

  const buttons = [
    ['C', '(', ')', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  return (
    <div style={styles.container}>
      <div style={styles.display}>{display}</div>
      {buttons.map((row, i) => (
        <div key={i} style={styles.row}>
          {row.map((btn) => (
            <button
              key={btn}
              onClick={() => handleButton(btn)}
              style={{
                ...styles.btn,
                ...(btn === '=' ? styles.equalsBtn : {}),
                ...(btn === 'C' ? styles.clearBtn : {}),
              }}
            >
              {btn}
            </button>
          ))}
        </div>
      ))}
      <p style={styles.hint}>Calculator v1.0</p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 320,
    margin: '60px auto',
    background: '#1c1c1e',
    borderRadius: 24,
    padding: 20,
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  },
  display: {
    background: '#000',
    color: '#fff',
    fontSize: 48,
    textAlign: 'right',
    padding: '20px 16px',
    borderRadius: 12,
    marginBottom: 16,
    minHeight: 80,
    wordBreak: 'break-all',
  },
  row: { display: 'flex', gap: 8, marginBottom: 8 },
  btn: {
    flex: 1,
    height: 70,
    fontSize: 24,
    borderRadius: 12,
    border: 'none',
    background: '#333',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '500',
  },
  equalsBtn: { background: '#ff9500', flex: 1 },
  clearBtn: { background: '#a5a5a5', color: '#000' },
  hint: { color: '#555', fontSize: 11, textAlign: 'center', marginTop: 8 },
};