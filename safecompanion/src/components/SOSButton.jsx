import React, { useState, useCallback } from 'react';
import { useShake } from '../hooks/useShake';
import { useImpactDetect } from '../hooks/useImpactDetect';

// Inside the component, add:
useImpactDetect((force) => {
  console.log('Impact detected, force:', force);
  triggerSOS();
});
const WHATSAPP_NUMBER = '230XXXXXXXX'; // ← PUT YOUR TRUSTED CONTACT NUMBER HERE

function sendWhatsApp(lat, lng) {
  const link = `https://www.google.com/maps?q=${lat},${lng}`;
  const msg = `🚨 EMERGENCY SOS! I need help right now.\n📍 My location: ${link}\nPlease call me or contact police (999) immediately.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

function playAlarm() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = i % 2 === 0 ? 880 : 660;
      osc.type = 'square';
      gain.gain.value = 0.4;
      osc.start(ctx.currentTime + i * 0.3);
      osc.stop(ctx.currentTime + i * 0.3 + 0.25);
    }
  } catch {}
}

export default function SOSButton() {
  const [status, setStatus] = useState('idle'); // idle | locating | activated

  const triggerSOS = useCallback(() => {
    if (status === 'activated') return;
    setStatus('locating');
    playAlarm();

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setStatus('activated');
        sendWhatsApp(coords.latitude, coords.longitude);
        setTimeout(() => setStatus('idle'), 15000);
      },
      () => {
        // No GPS — send WhatsApp without location
        setStatus('activated');
        const msg = '🚨 EMERGENCY SOS! I need help. Could not get GPS location. Call me or call 999!';
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
        setTimeout(() => setStatus('idle'), 15000);
      },
      { timeout: 5000, enableHighAccuracy: true }
    );
  }, [status]);

  // Shake detection auto-triggers SOS
  useShake(triggerSOS);

  return (
    <div style={{ padding: '8px 0 16px' }}>
      <button
        className={`sos-btn ${status === 'activated' ? 'activated' : ''}`}
        onClick={triggerSOS}
        disabled={status === 'locating'}
      >
        {status === 'idle'      && '🆘 EMERGENCY SOS'}
        {status === 'locating'  && '📍 Getting location...'}
        {status === 'activated' && '🚨 SOS SENT — CALL 999 NOW'}
      </button>
      <p className="privacy-badge">
        🤝 Shake your phone to trigger · Opens WhatsApp with GPS
      </p>
    </div>
  );
}