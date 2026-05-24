import React, { useState } from 'react';

import { encrypt, decrypt } from '../utils/crypto';

const STORAGE_KEY = 'safe_journal';

export default function EvidenceJournal() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), description: '', location: '' });
  const [passphrase, setPassphrase] = useState('');
  const [passphraseSet, setPassphraseSet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('list'); // 'list' or 'add'

  const setupPassphrase = () => {
    if (passphrase.length < 4) {
      alert('Please use at least 4 characters for your passphrase.');
      return;
    }
    setPassphraseSet(true);
    loadEntries(passphrase);
  };

  const loadEntries = async (pass) => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const decrypted = await decrypt(raw, pass);
      setEntries(JSON.parse(decrypted));
    } catch {
      alert('Wrong passphrase — cannot read journal.');
    }
  };

  const saveEntries = async (newEntries) => {
    const encrypted = await encrypt(JSON.stringify(newEntries), passphrase);
    localStorage.setItem(STORAGE_KEY, encrypted);
  };

  const addEntry = async () => {
    if (!form.description.trim()) return;
    setLoading(true);
    const newEntry = { ...form, id: Date.now(), createdAt: new Date().toISOString() };
    const updated = [newEntry, ...entries];
    await saveEntries(updated);
    setEntries(updated);
    setForm({ date: new Date().toISOString().slice(0, 10), description: '', location: '' });
    setView('list');
    setLoading(false);
  };

  const deleteEntry = async (id) => {
    if (!window.confirm('Delete this entry permanently?')) return;
    const updated = entries.filter(e => e.id !== id);
    await saveEntries(updated);
    setEntries(updated);
  };

  if (!passphraseSet) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>📝 Evidence Journal</h2>
        <p style={styles.sub}>Your journal is encrypted on this device only. Create a passphrase to unlock it.</p>
        <input
          type="password"
          value={passphrase}
          onChange={e => setPassphrase(e.target.value)}
          placeholder="Enter your passphrase"
          style={styles.input}
        />
        <button onClick={setupPassphrase} style={styles.btn}>Unlock Journal</button>
        <p style={styles.warning}>⚠️ If you forget this passphrase, the journal cannot be recovered.</p>
      </div>
    );
  }

  if (view === 'add') {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Add Entry</h2>
        <label style={styles.label}>Date</label>
        <input type="date" value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
          style={styles.input} />
        <label style={styles.label}>Location</label>
        <input type="text" value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })}
          placeholder="Where did it happen?"
          style={styles.input} />
        <label style={styles.label}>What happened</label>
        <textarea value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="Describe the incident in your own words..."
          style={{ ...styles.input, height: 120, resize: 'vertical' }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={addEntry} style={styles.btn} disabled={loading}>
            {loading ? 'Saving...' : 'Save Entry'}
          </button>
          <button onClick={() => setView('list')} style={styles.cancelBtn}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={styles.title}>📝 Journal ({entries.length})</h2>
        <button onClick={() => setView('add')} style={styles.btn}>+ Add</button>
      </div>
      {entries.length === 0 && <p style={styles.sub}>No entries yet. Tap + Add to record an incident.</p>}
      {entries.map(entry => (
        <div key={entry.id} style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong style={styles.cardDate}>{entry.date}</strong>
            <button onClick={() => deleteEntry(entry.id)} style={styles.deleteBtn}>Delete</button>
          </div>
          {entry.location && <p style={styles.cardLoc}>📍 {entry.location}</p>}
          <p style={styles.cardDesc}>{entry.description}</p>
        </div>
      ))}
      <p style={styles.privacy}>🔒 All entries are AES-256 encrypted. Only readable with your passphrase.</p>
    </div>
  );
}

const styles = {
  container: { paddingBottom: 20 },
  title: { fontSize: 20, fontWeight: 600, marginBottom: 8 },
  sub: { fontSize: 14, color: '#718096', marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, marginTop: 12, color: '#4a5568' },
  input: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 15, boxSizing: 'border-box', fontFamily: 'inherit' },
  btn: { background: '#4a5568', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
  cancelBtn: { background: '#e2e8f0', color: '#4a5568', border: 'none', borderRadius: 8, padding: '10px 18px', cursor: 'pointer', fontSize: 14 },
  deleteBtn: { background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: 13 },
  card: { background: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  cardDate: { fontSize: 14, color: '#4a5568' },
  cardLoc: { fontSize: 13, color: '#718096', margin: '4px 0' },
  cardDesc: { fontSize: 15, lineHeight: 1.6 },
  warning: { fontSize: 12, color: '#e53e3e', marginTop: 12 },
  privacy: { fontSize: 11, color: '#a0aec0', textAlign: 'center', marginTop: 16 },
};