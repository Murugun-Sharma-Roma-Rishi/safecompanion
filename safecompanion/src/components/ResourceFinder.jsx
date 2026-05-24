import React, { useState } from 'react';
import resources from '../data/resources.json';

export default function ResourceFinder() {
  const [tab, setTab] = useState('hotlines');

  const sections = [
    { id: 'hotlines', label: '📞 Hotlines', data: resources.hotlines },
    { id: 'shelters', label: '🏠 Shelters', data: resources.shelters },
    { id: 'legal',    label: '⚖️ Legal Aid', data: resources.legal },
  ];

  const current = sections.find(s => s.id === tab);

  return (
    <div>
      <h2 style={styles.title}>Help in Mauritius</h2>
      <p style={styles.sub}>All numbers work offline. Tap a phone number to call.</p>

      <div style={styles.tabs}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setTab(s.id)}
            style={{ ...styles.tab, ...(tab === s.id ? styles.tabActive : {}) }}>
            {s.label}
          </button>
        ))}
      </div>

      {current.data.map((item, i) => (
        <div key={i} style={styles.card}>
          <strong style={styles.cardTitle}>{item.name}</strong>
          <p style={styles.cardDesc}>{item.description}</p>
          {item.hours && <p style={styles.hours}>⏰ {item.hours}</p>}
          <a href={`tel:${item.phone}`} style={styles.phone}>
            📞 {item.phone}
          </a>
          {item.address && <p style={styles.address}>📍 {item.address}</p>}
        </div>
      ))}
    </div>
  );
}

const styles = {
  title: { fontSize: 20, fontWeight: 600, marginBottom: 4 },
  sub: { fontSize: 13, color: '#718096', marginBottom: 16 },
  tabs: { display: 'flex', gap: 8, marginBottom: 16 },
  tab: { flex: 1, padding: '8px 4px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 13 },
  tabActive: { background: '#4a5568', color: '#fff', border: '1px solid #4a5568' },
  card: { background: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  cardTitle: { fontSize: 16, display: 'block', marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#4a5568', marginBottom: 6 },
  hours: { fontSize: 13, color: '#718096', marginBottom: 4 },
  phone: { display: 'inline-block', background: '#48bb78', color: '#fff', padding: '8px 14px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 15 },
  address: { fontSize: 13, color: '#718096', marginTop: 6 },
};