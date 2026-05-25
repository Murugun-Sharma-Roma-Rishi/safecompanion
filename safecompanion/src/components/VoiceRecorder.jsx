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

      // Pick a format that works on both iOS Safari and Android Chrome
      const mimeType = MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : '';

      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || 'audio/mp4' });
        onRecorded(blob);
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start(100); // collect data every 100ms — needed on some mobile browsers
      mediaRef.current = mr;
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } catch (err) {
      console.error(err);
      alert('Microphone access denied. Please allow microphone permission in your browser settings.');
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
      {recording && <span style={{ color: '#dc2626', fontSize: 13 }}>● Recording...</span>}
    </div>
  );
}