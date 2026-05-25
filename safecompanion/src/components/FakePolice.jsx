import React, { useState } from 'react';

const SCRIPT = [
  'Attention. This is the Mauritius Police Force.',
  'Officers are currently en route to your location.',
  'Estimated arrival time: two minutes.',
  'Please remain calm. Help is on the way.',
  'This is an automated safety alert.',
];

export default function FakePolice() {
  const [playing, setPlaying] = useState(false);

  const getVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    return voices.find(v => v.name.includes('Daniel')) ||
           voices.find(v => v.name.includes('Google UK English Male')) ||
           voices.find(v => v.lang === 'en-GB') ||
           voices.find(v => v.lang.startsWith('en')) || null;
  };

  const speak = () => {
    let i = 0;
    const next = () => {
      if (i >= SCRIPT.length) { setPlaying(false); return; }
      const utt = new SpeechSynthesisUtterance(SCRIPT[i]);
      utt.rate = 0.88; utt.pitch = 0.8; utt.volume = 1;
      const v = getVoice(); if (v) utt.voice = v;
      utt.onend = () => { i++; next(); };
      utt.onerror = () => { i++; next(); };
      window.speechSynthesis.speak(utt);
    };
    next();
  };

  const playFakeCall = () => {
    if (playing) { window.speechSynthesis.cancel(); setPlaying(false); return; }
    setPlaying(true);
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.onvoiceschanged = null; speak(); };
    } else {
      speak();
    }
  };

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <p className="section-title">📞 Fake Police Call</p>
      <p className="section-sub">Plays an authoritative police announcement to deter an attacker.</p>
      <button onClick={playFakeCall} className={`btn ${playing ? 'btn-danger' : 'btn-primary'}`}>
        {playing ? '⏹ Stop' : '📞 Activate Police Audio'}
      </button>
      <p className="privacy-badge">⚠️ For deterrence only. Always call real police on 999.</p>
    </div>
  );
}