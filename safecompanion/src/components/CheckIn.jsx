import React, { useState, useEffect, useRef } from 'react';

function getContact() {
  return localStorage.getItem('emergency_contact') || '';
}

export default function CheckIn() {
  const [deadline, setDeadline] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [minutes, setMinutes] = useState(30);
  const deadlineRef = useRef(null);

  const triggerMissedAlert = () => {
    const number = getContact();
    if (!number) {
      alert('⚠️ Check-in missed but no emergency contact is set. Please set one in the SOS tab.');
      return;
    }
    const msg = '🚨 SAFETY CHECK-IN MISSED!\nI set a check-in timer and did not confirm I\'m safe. Please check on me or call 999.\n\n(Automated alert from my safety app)';
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  useEffect(() => {
    if (!deadline) { setTimeLeft(null); return; }
    deadlineRef.current = deadline;
    const interval = setInterval(() => {
      const left = deadlineRef.current - Date.now();
      if (left <= 0) {
        clearInterval(interval);
        deadlineRef.current = null;
        setDeadline(null);
        setTimeLeft(null);
        triggerMissedAlert();
      } else {
        setTimeLeft(left);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]); // eslint-disable-line react-hooks/exhaustive-deps

  const startTimer = () => {
    if (!getContact()) {
      alert('⚠️ Please set an emergency contact in the SOS tab first.');
      return;
    }
    setDeadline(Date.now() + minutes * 60 * 1000);
  };

  const confirmSafe = () => { deadlineRef.current = null; setDeadline(null); setTimeLeft(null); };

  const fmt = (ms) => {
    if (!ms || ms < 0) return '0:00';
    return `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}`;
  };

  const urgent = timeLeft !== null && timeLeft < 60000;
  const hasContact = !!getContact();

  return (
    <div className="card">
      <p className="section-title">⏱ Check-in Timer</p>
      <p className="section-sub">If you don't tap "I'm Safe" before it ends, WhatsApp alert fires automatically.</p>
      {!hasContact && (
        <p style={{ fontSize: 13, color: 'var(--danger)', fontWeight: 600, marginBottom: 10 }}>
          ⚠️ No emergency contact set. Go to SOS tab to add one.
        </p>
      )}
      {!deadline ? (
        <div>
          <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>How many minutes?</label>
          <input type="number" value={minutes} min={1} max={180}
            onChange={e => setMinutes(Math.max(1, Number(e.target.value)))}
            className="input" style={{ marginBottom: 12 }} />
          <button onClick={startTimer} className="btn btn-primary">Start Timer</button>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 56, fontWeight: 800, color: urgent ? 'var(--danger)' : 'var(--primary)', marginBottom: 8 }}>
            {fmt(timeLeft)}
          </div>
          {urgent && <p style={{ color: 'var(--danger)', fontWeight: 600, marginBottom: 12 }}>⚠️ Alert sending soon!</p>}
          <button onClick={confirmSafe} className="btn btn-primary" style={{ marginBottom: 8 }}>✓ I'm Safe</button>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tap if safe. Zero = alert fires.</p>
        </div>
      )}
    </div>
  );
}