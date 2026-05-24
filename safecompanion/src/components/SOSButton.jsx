import React, { useState } from 'react';

export default function SOSButton() {
  const [activated, setActivated] = useState(false);

  const triggerSOS = () => {
    setActivated(true);

    // 1. Play alarm sound using Web Audio API
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    for (let i = 0; i < 3; i++) {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.value = 880;
      oscillator.type = 'square';
      gainNode.gain.value = 0.3;
      oscillator.start(audioCtx.currentTime + i * 0.4);
      oscillator.stop(audioCtx.currentTime + i * 0.4 + 0.3);
    }

    // 2. Get GPS location and show it
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        alert(`🚨 SOS ACTIVATED\n\nYour location:\n${mapsLink}\n\nShare this link with someone you trust or call 999 now.`);
      }, () => {
        alert('🚨 SOS ACTIVATED\n\nCall 999 NOW. Could not get your GPS location.');
      });
    }

    // Reset after 10 seconds
    setTimeout(() => setActivated(false), 10000);
  };

  return (
    <div style={styles.container}>
      <button
        onClick={triggerSOS}
        style={{ ...styles.btn, ...(activated ? styles.btnActive : {}) }}
      >
        {activated ? '🚨 SOS SENT — CALL 999 NOW' : '🆘 EMERGENCY SOS'}
      </button>
      <p style={styles.hint}>Tap for alarm + GPS location</p>
    </div>
  );
}

const styles = {
  container: { padding: '8px 0', textAlign: 'center' },
  btn: {
    width: '100%',
    padding: '14px',
    background: '#e53e3e',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 18,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: 1,
    transition: 'background 0.2s',
  },
  btnActive: { background: '#9b2c2c', animation: 'pulse 1s infinite' },
  hint: { fontSize: 11, color: '#a0aec0', marginTop: 4 },
};