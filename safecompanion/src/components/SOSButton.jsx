import React, { useState, useCallback, useRef } from 'react';
import { useShake } from '../hooks/useShake';
import { useImpactDetect } from '../hooks/useImpactDetect';

function getContact() {
  return localStorage.getItem('emergency_contact') || '';
}

function sendWhatsApp(lat, lng) {
  const number = getContact();
  if (!number) {
    alert('⚠️ No emergency contact set. Please go to SOS tab → Set Emergency Contact before using SOS.');
    return;
  }
  const msg = lat
    ? `🚨 EMERGENCY SOS! I need help right now.\n📍 My location: https://www.google.com/maps?q=${lat},${lng}\nPlease call me or contact police (999) immediately.`
    : `🚨 EMERGENCY SOS! I need help. Could not get GPS. Please call me or call 999!`;
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, '_blank');
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

function ContactSetup() {
  const [value, setValue] = useState(localStorage.getItem('emergency_contact') || '');
  const [saved, setSaved] = useState(false);

  const save = () => {
    const cleaned = value.replace(/\s+/g, '').replace(/^\+/, '');
    if (!cleaned || cleaned.length < 7) {
      alert('Please enter a valid WhatsApp number with country code, e.g. 23071234567');
      return;
    }
    localStorage.setItem('emergency_contact', cleaned);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <p className="section-title">📱 Emergency Contact</p>
      <p className="section-sub">Enter your trusted contact's WhatsApp number with country code. No + sign needed.</p>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
        Example: <strong>23071234567</strong> (Mauritius = 230 + number)
      </p>
      <input
        type="tel"
        value={value}
        onChange={e => { setValue(e.target.value); setSaved(false); }}
        placeholder="e.g. 23071234567"
        className="input"
        style={{ marginBottom: 10 }}
      />
      <button onClick={save} className="btn btn-primary">
        {saved ? '✓ Saved!' : 'Save Contact'}
      </button>
      {localStorage.getItem('emergency_contact') && (
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
          ✅ Current: +{localStorage.getItem('emergency_contact')}
        </p>
      )}
    </div>
  );
}

export default function SOSButton() {
  const [status, setStatus] = useState('idle');
  const statusRef = useRef('idle');

  const triggerSOS = useCallback(() => {
    if (statusRef.current !== 'idle') return;
    if (!getContact()) {
      alert('⚠️ No emergency contact set. Please set one below before using SOS.');
      return;
    }
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
        {status === 'idle'      && '🆘 EMERGENCY SOS'}
        {status === 'locating'  && '📍 Getting location...'}
        {status === 'activated' && '🚨 SOS SENT — CALL 999 NOW'}
      </button>
      <p className="privacy-badge">🤝 Shake phone to trigger · Opens WhatsApp with GPS</p>
      <ContactSetup />
    </div>
  );
}