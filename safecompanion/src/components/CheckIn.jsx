import React, { useState, useEffect } from 'react';

const WHATSAPP_NUMBER = '230XXXXXXXX'; // same trusted contact

export default function CheckIn({ compact = false }) {
  const [deadline, setDeadline] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [setting, setSetting] = useState(false);
  const [minutes, setMinutes] = useState(30);

  useEffect(() => {
    if (!deadline) return;
    const interval = setInterval(() => {
      const left = deadline - Date.now();
      if (left <= 0) {
        clearInterval(interval);
        setDeadline(null);
        setTimeLeft(null);
        triggerMissedAlert();
      } else {
        setTimeLeft(left);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const triggerMissedAlert = () => {
    const msg = '🚨 SAFETY CHECK-IN MISSED!\nI set a check-in timer and did not confirm I\'m safe. Please check on me or call 999.\n\nThis is an automated alert from my safety app.';
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const startTimer = () => {
    setDeadline(Date.now() + minutes * 60 * 1000);
    setSetting(false);
  };

  const confirmSafe = () => {
    setDeadline(null);
    setTimeLeft(null);
  };

  const fmt = (ms) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (compact) {
    // Shows in top bar
    if (!deadline) return (
      <button onClick={() => setSetting(true)}
        style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, color: 'white', padding: '6px 10px', fontSize: 12, cursor: 'pointer' }}>
        ⏱ Check-in
      </button>
    );
    return (
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ color: timeLeft < 60000 ? '#fca5a5' : '#c4b5fd', fontSize: 13, fontWeight: 700 }}>
          ⏱ {fmt(timeLeft)}
        </span>
        <button onClick={confirmSafe}
          style={{ background: '#16a34a', border: 'none', borderRadius: 6, color: 'white', padding: '4px 8px', fontSize: 11, cursor: 'pointer' }}>
          ✓ Safe
        </button>
      </div>
    );
  }

  // Full view (not used currently but available)
  return (
    <div className="card">
      <p className="section-title">⏱ Check-in Timer</p>
      <p className="section-sub">Set a timer. If you don't confirm safe before it ends, WhatsApp alert fires automatically.</p>
      {!deadline ? (
        <div>
          <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>How many minutes?</label>
          <input type="number" value={minutes} onChange={e => setMinutes(+e.target.value)}
            className="input" style={{ marginBottom: 12, marginTop: 4 }} min={1} max={180} />
          <button onClick={startTimer} className="btn btn-primary">Start Timer</button>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: timeLeft < 60000 ? 'var(--danger)' : 'var(--primary)', marginBottom: 16 }}>
            {fmt(timeLeft)}
          </div>
          <button onClick={confirmSafe} className="btn btn-primary" style={{ marginBottom: 8 }}>✓ I'm Safe</button>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tap if you're safe. If timer hits zero, alert sends automatically.</p>
        </div>
      )}
    </div>
  );
}