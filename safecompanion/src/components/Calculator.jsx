import React, { useState } from 'react';

const SECRET_PIN = '1234'; // ← change this

export default function Calculator({ onUnlock }) {
  const [display, setDisplay] = useState('0');
  const [expr, setExpr] = useState('');
  const [justEvaled, setJustEvaled] = useState(false);

  const handle = (val) => {
    if (val === 'C') { setDisplay('0'); setExpr(''); setJustEvaled(false); return; }
    if (val === '±') {
      const n = String(parseFloat(display || '0') * -1);
      setDisplay(n); setExpr(n); setJustEvaled(false); return;
    }
    if (val === '%') {
      const n = String(parseFloat(display || '0') / 100);
      setDisplay(n); setExpr(n); setJustEvaled(false); return;
    }
    if (val === '=') {
      if (expr === SECRET_PIN) { onUnlock(); return; }
      try {
        // eslint-disable-next-line no-eval
        const r = String(eval(expr));
        setDisplay(r); setExpr(r); setJustEvaled(true);
      } catch { setDisplay('Error'); setExpr(''); setJustEvaled(false); }
      return;
    }
    if (justEvaled && /[0-9.]/.test(val)) {
      setExpr(val); setDisplay(val); setJustEvaled(false); return;
    }
    const next = expr + val;
    setExpr(next); setDisplay(next); setJustEvaled(false);
  };

  const opMap = { '÷': '/', '×': '*', '−': '-' };
  const rows = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '−'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  return (
    <div style={{ minHeight: '100dvh', background: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 16 }}>
      <div style={{ color: '#fff', fontSize: display.length > 9 ? 34 : 60, fontWeight: 200, textAlign: 'right', padding: '0 8px 24px', letterSpacing: -2, wordBreak: 'break-all' }}>
        {display || '0'}
      </div>
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          {row.map(btn => {
            const isOp = ['÷','×','−','+','='].includes(btn);
            const isTop = ['C','±','%'].includes(btn);
            const isZero = btn === '0';
            return (
              <button key={btn} onClick={() => handle(opMap[btn] ?? btn)} style={{
                flex: isZero ? 2 : 1, height: 76, borderRadius: 50, border: 'none',
                fontSize: 28, cursor: 'pointer',
                background: isOp ? '#ff9f0a' : isTop ? '#d4d4d2' : '#333',
                color: isTop ? '#000' : '#fff',
                textAlign: isZero ? 'left' : 'center',
                paddingLeft: isZero ? 28 : 0,
              }}>
                {btn}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}