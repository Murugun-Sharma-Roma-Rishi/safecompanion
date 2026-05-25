import React, { useState, useRef } from 'react';

export default function VoiceRecorder({ onRecorded }) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const mediaRef = useRef(null);
  const timerRef = useRef(null);
  const chunksRef = useRef([]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = e => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecorded(blob);
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      mediaRef.current = mr;
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } catch {
      alert('Microphone access denied.');
    }
  };

  const stop = () => {
    mediaRef.current?.stop();
    clearInterval(timerRef.current);
    setRecording(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
      <button
        onClick={recording ? stop : start}
        className={`btn ${recording ? 'btn-danger' : 'btn-primary'}`}
        style={{ width: 'auto', padding: '10px 18px' }}
      >
        {recording ? `⏹ Stop (${seconds}s)` : '🎙 Record Voice Note'}
      </button>
      {recording && (
        <span style={{ color: '#dc2626', fontSize: 13 }}>● Recording...</span>
      )}
    </div>
  );
}