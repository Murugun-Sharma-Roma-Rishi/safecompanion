import React, { useState, useCallback, useRef } from 'react';
import { useShake } from '../hooks/useShake';
import { useImpactDetect } from '../hooks/useImpactDetect';

const WHATSAPP_NUMBER = '230XXXXXXXX'; // ← your number here

function sendWhatsApp(lat, lng) {
  const msg = lat
    ? `🚨 EMERGENCY SOS! I need help right now.\n📍 My location: https://www.google.com/maps?q=${lat},${lng}\nPlease call me or contact police (999) immediately.`
    : `🚨 EMERGENCY SOS! I need help. Could not get GPS. Please call me or call 999!`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

function playAlarm() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    for (let i = 0; i < 6; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = i % 2 === 0 ? 880 : 660;
      osc.type = 'square'; gain.gain.value = 0.4;
      osc.start(ctx.currentTime + i * 0.3);
      osc.stop(ctx.currentTime + i * 0.3 + 0.25);
    }
  } catch (e) {}
}

export default function SOSButton() {
  const [status, setStatus] = useState('idle');
  const statusRef = useRef('idle');

  const triggerSOS = useCallback(() => {
    if (statusRef.current !== 'idle') return;
    statusRef.current = 'locating';
    setStatus('locating');
    playAlarm();

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        statusRef.current = 'activated'; setStatus('activated');
        sendWhatsApp(coords.latitude, coords.longitude);
        setTimeout(() => { statusRef.current = 'idle'; setStatus('idle'); }, 15000);
      },
      () => {
        statusRef.current = 'activated'; setStatus('activated');
        sendWhatsApp(null, null);
        setTimeout(() => { statusRef.current = 'idle'; setStatus('idle'); }, 15000);
      },
      { timeout: 5000, enableHighAccuracy: true }
    );
  }, []);

  useShake(triggerSOS);
  useImpactDetect(triggerSOS);

  return (
    <div style={{ padding: '8px 0 16px' }}>
      <button
        className={`sos-btn ${status === 'activated' ? 'activated' : ''}`}
        onClick={triggerSOS}
        disabled={status === 'locating'}
      >
        {status === 'idle'     && '🆘 EMERGENCY SOS'}
        {status === 'locating' && '📍 Getting location...'}
        {status === 'activated'&& '🚨 SOS SENT — CALL 999 NOW'}
      </button>
      <p className="privacy-badge">🤝 Shake phone to trigger · Opens WhatsApp with GPS</p>
    </div>
  );
}