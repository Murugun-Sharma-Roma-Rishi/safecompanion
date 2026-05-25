import React, { useState, useRef } from 'react';

// The audio is a generated police-style voice message
// Best approach: record a custom audio file and put it in /public/police.mp3
// OR use the Web Speech API to generate it on-device (no file needed)

export default function FakePolice() {
  const [playing, setPlaying] = useState(false);
  const speechRef = useRef(null);

  const playFakeCall = () => {
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }

    setPlaying(true);

    const script = [
      "Attention. This is the Mauritius Police Force.",
      "Officers are currently en route to your location.",
      "Estimated arrival time: two minutes.",
      "Please remain calm. Help is on the way.",
      "This is an automated safety alert.",
    ];

    let i = 0;
    const speakNext = () => {
      if (i >= script.length) { setPlaying(false); return; }
      const utt = new SpeechSynthesisUtterance(script[i]);
      utt.rate = 0.88;
      utt.pitch = 0.85;
      utt.volume = 1;
      // Pick a lower-pitched voice if available
      const voices = window.speechSynthesis.getVoices();
      const deep = voices.find(v => v.name.toLowerCase().includes('male') || v.name.includes('Daniel') || v.name.includes('Google UK'));
      if (deep) utt.voice = deep;
      utt.onend = () => { i++; speakNext(); };
      window.speechSynthesis.speak(utt);
    };

    speakNext();
  };

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <p className="section-title">📞 Fake Police Call</p>
      <p className="section-sub">
        Plays an official-sounding police announcement out loud — designed to deter an attacker.
      </p>
      <button
        onClick={playFakeCall}
        className={`btn ${playing ? 'btn-danger' : 'btn-primary'}`}
      >
        {playing ? '⏹ Stop Call' : '📞 Activate Police Audio'}
      </button>
      <p className="privacy-badge">⚠️ For deterrence only. Always call real police on 999.</p>
    </div>
  );
}