import React, { useState } from 'react';
import AIChat from './AIChat';
import ResourceFinder from './ResourceFinder';
import EvidenceJournal from './EvidenceJournal';
import SafetyPlan from './SafetyPlan';
import DangerQuiz from './DangerQuiz';
import SOSButton from './SOSButton';

const tabs = [
  { id: 'chat',      label: '💬 Chat' },
  { id: 'resources', label: '📍 Help' },
  { id: 'journal',   label: '📝 Journal' },
  { id: 'plan',      label: '🛡️ My Plan' },
  { id: 'quiz',      label: '📊 Safety Check' },
];

export default function MainApp({ onExit }) {
  const [activeTab, setActiveTab] = useState('chat');

  // Quick exit: goes to google.com immediately
  const quickExit = () => {
    sessionStorage.clear();
    onExit();
    window.location.replace('https://www.google.com');
  };

  return (
    <div style={styles.container}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <span style={styles.appName}>Safe Companion</span>
        <button onClick={quickExit} style={styles.exitBtn}>
          ✕ Exit Now
        </button>
      </div>

      {/* SOS always visible at top */}
      <SOSButton />

      {/* Tab content */}
      <div style={styles.content}>
        {activeTab === 'chat'      && <AIChat />}
        {activeTab === 'resources' && <ResourceFinder />}
        {activeTab === 'journal'   && <EvidenceJournal />}
        {activeTab === 'plan'      && <SafetyPlan />}
        {activeTab === 'quiz'      && <DangerQuiz />}
      </div>

      {/* Bottom navigation */}
      <div style={styles.navBar}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.navBtn,
              ...(activeTab === tab.id ? styles.navBtnActive : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 480, margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column', background: '#f9f9f9' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#4a5568', color: '#fff' },
  appName: { fontWeight: 600, fontSize: 18 },
  exitBtn: { background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
  content: { flex: 1, overflow: 'auto', padding: 16 },
  navBar: { display: 'flex', borderTop: '1px solid #e2e8f0', background: '#fff' },
  navBtn: { flex: 1, padding: '10px 4px', border: 'none', background: 'none', fontSize: 11, cursor: 'pointer', color: '#718096' },
  navBtnActive: { color: '#4a5568', borderTop: '2px solid #4a5568', fontWeight: 600 },
};