import React, { useState } from 'react';
import { encrypt, decrypt } from '../utils/crypto';
import VoiceRecorder from './VoiceRecorder';

const STORAGE_KEY = 'safe_journal_v2';

const emptyForm = () => ({
  date: new Date().toISOString().slice(0, 10),
  description: '',
  location: '',
  photo: null,
  voice: null,
});

export default function EvidenceJournal() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [passphrase, setPassphrase] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('list');
  const [expanded, setExpanded] = useState(null);

  const setupPassphrase = async () => {
    if (passphrase.length < 4) {
      alert('Use at least 4 characters.');
      return;
    }
    setUnlocked(true);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const dec = await decrypt(raw, passphrase);
      setEntries(JSON.parse(dec));
    } catch {
      alert('Wrong passphrase — cannot read journal.');
      setUnlocked(false);
    }
  };

  const saveEntries = async (list) => {
    const enc = await encrypt(JSON.stringify(list), passphrase);
    localStorage.setItem(STORAGE_KEY, enc);
  };

  const addEntry = async () => {
    if (!form.description.trim()) return;
    setLoading(true);
    const entry = { ...form, id: Date.now(), createdAt: new Date().toISOString() };
    const updated = [entry, ...entries];
    await saveEntries(updated);
    setEntries(updated);
    setForm(emptyForm());
    setView('list');
    setLoading(false);
  };

  const deleteEntry = async (id) => {
    if (!window.confirm('Delete this entry permanently?')) return;
    const updated = entries.filter(e => e.id !== id);
    await saveEntries(updated);
    setEntries(updated);
  };

  // Passphrase screen
  if (!unlocked) {
    return (
      <div>
        <p className="section-title">📝 Evidence Journal</p>
        <p className="section-sub">
          All entries are AES-256 encrypted on your device only.
          Enter your passphrase to access.
        </p>
        <div className="card">
          <input
            type="password"
            value={passphrase}
            onChange={e => setPassphrase(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && setupPassphrase()}
            placeholder="Your passphrase"
            className="input"
            style={{ marginBottom: 12 }}
          />
          <button onClick={setupPassphrase} className="btn btn-primary">
            Unlock Journal
          </button>
          <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 10 }}>
            ⚠️ Forgotten passphrase = unrecoverable entries. Keep it safe.
          </p>
        </div>
      </div>
    );
  }

  // Add entry screen
  if (view === 'add') {
    return (
      <div>
        <p className="section-title">Add Entry</p>
        <div className="card">
          {/* Date */}
          <label style={lbl}>Date</label>
          <input type="date" value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className="input" style={{ marginBottom: 12 }} />

          {/* Location */}
          <label style={lbl}>Location (optional)</label>
          <input type="text" value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
            placeholder="Where did it happen?"
            className="input" style={{ marginBottom: 12 }} />

          {/* Description */}
          <label style={lbl}>What happened</label>
          <textarea value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the incident in your own words..."
            className="input"
            style={{ height: 100, resize: 'vertical', marginBottom: 12 }}
          />

          {/* Photo */}
          <label style={lbl}>📷 Photo evidence (optional)</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={e => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = ev => setForm(f => ({ ...f, photo: ev.target.result }));
              reader.readAsDataURL(file);
            }}
            style={{ marginBottom: 8, fontSize: 14 }}
          />
          {form.photo && (
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <img src={form.photo} alt="Evidence"
                style={{ width: '100%', borderRadius: 10, maxHeight: 200, objectFit: 'cover' }} />
              <button
                onClick={() => setForm(f => ({ ...f, photo: null }))}
                style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: 26, height: 26, cursor: 'pointer', fontSize: 14 }}>
                ✕
              </button>
            </div>
          )}

          {/* Voice */}
          <label style={lbl}>🎙 Voice note (optional)</label>
          <VoiceRecorder onRecorded={blob => {
            const reader = new FileReader();
            reader.onload = ev => setForm(f => ({ ...f, voice: ev.target.result }));
            reader.readAsDataURL(blob);
          }} />
          {form.voice && (
            <audio controls src={form.voice}
              style={{ width: '100%', marginBottom: 12 }} />
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button onClick={addEntry} className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : '💾 Save Entry'}
            </button>
            <button onClick={() => setView('list')} className="btn btn-ghost">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List screen
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <p className="section-title">📝 Journal ({entries.length})</p>
        <button onClick={() => setView('add')} className="btn btn-primary" style={{ width: 'auto', padding: '8px 14px' }}>
          + Add
        </button>
      </div>
      <p className="section-sub">Encrypted. Only readable with your passphrase.</p>

      {entries.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          No entries yet. Tap + Add to record an incident.
        </div>
      )}

      {entries.map(entry => (
        <div key={entry.id} className="card" style={{ cursor: 'pointer' }}
          onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <strong style={{ fontSize: 15 }}>{entry.date}</strong>
              {entry.location && <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0' }}>📍 {entry.location}</p>}
              {/* Indicators */}
              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                {entry.photo && <span style={badge}>📷 Photo</span>}
                {entry.voice && <span style={badge}>🎙 Audio</span>}
              </div>
            </div>
            <button
              onClick={e => { e.stopPropagation(); deleteEntry(entry.id); }}
              style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 13 }}>
              Delete
            </button>
          </div>

          {expanded === entry.id && (
            <div style={{ marginTop: 12 }}>
              <p style={{ fontSize: 15, lineHeight: 1.7 }}>{entry.description}</p>
              {entry.photo && (
                <img src={entry.photo} alt="Evidence"
                  style={{ width: '100%', borderRadius: 10, marginTop: 10, maxHeight: 220, objectFit: 'cover' }} />
              )}
              {entry.voice && (
                <audio controls src={entry.voice}
                  style={{ width: '100%', marginTop: 10 }} />
              )}
            </div>
          )}
        </div>
      ))}

      <p className="privacy-badge">🔒 AES-256 encrypted · Device only · No server</p>
    </div>
  );
}

const lbl = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' };
const badge = { fontSize: 11, background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 6, padding: '2px 7px' };