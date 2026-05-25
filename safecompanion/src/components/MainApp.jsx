import React, { useState, useRef } from 'react';
import AIChat from './AIChat';
import ResourceFinder from './ResourceFinder';
import EvidenceJournal from './EvidenceJournal';
import SafetyPlan from './SafetyPlan';
import DangerQuiz from './DangerQuiz';
import SOSButton from './SOSButton';
import CheckIn from './CheckIn';
import SelfDefence from './SelfDefence';
import FakePolice from './FakePolice';

const tabs = [
  { id: 'chat',    label: 'Chat',    icon: '💬' },
  { id: 'sos',     label: 'SOS',     icon: '🆘' },
  { id: 'journal', label: 'Journal', icon: '📝' },
  { id: 'help',    label: 'Help',    icon: '📞' },
  { id: 'more',    label: 'More',    icon: '⋯'  },
];
function MoreMenu() {
  const [screen, setScreen] = useState(null);

  if (screen === 'quiz')   return <div><button onClick={() => setScreen(null)} style={backBtn}>← Back</button><DangerQuiz /></div>;
  if (screen === 'plan')   return <div><button onClick={() => setScreen(null)} style={backBtn}>← Back</button><SafetyPlan /></div>;

  return (
    <div>
      <p className="section-title">More Tools</p>
      <p className="section-sub">Choose what you need right now.</p>
      <div className="card" style={{ cursor: 'pointer' }} onClick={() => setScreen('quiz')}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>🔍</div>
        <strong style={{ fontSize: 16 }}>Danger Assessment Quiz</strong>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Rate your current risk level and get guidance on next steps.</p>
      </div>
      <div className="card" style={{ cursor: 'pointer' }} onClick={() => setScreen('plan')}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>📋</div>
        <strong style={{ fontSize: 16 }}>Safety Plan Builder</strong>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Build a personalised step-by-step escape plan.</p>
      </div>
    </div>
  );
}

const backBtn = {
  background: 'none', border: 'none', color: 'var(--primary)',
  fontSize: 15, fontWeight: 600, cursor: 'pointer',
  padding: '0 0 12px 0', display: 'block',
};
export default function MainApp({ onExit }) {
  const [activeTab, setActiveTab] = useState('chat');
  const [showCheckin, setShowCheckin] = useState(false);
  const tapCount = useRef(0);
  const tapTimer = useRef(null);

  const handleTitleTap = () => {
    tapCount.current += 1;
    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 600);
    if (tapCount.current >= 3) {
      tapCount.current = 0;
      sessionStorage.clear();
      window.location.replace('https://www.google.com');
    }
  };

  return (
    <div className="app-shell">
      {showCheckin && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.55)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 20, width: '100%' }}>
            <CheckIn />
            <button onClick={() => setShowCheckin(false)} className="btn btn-ghost" style={{ marginTop: 12 }}>Close</button>
          </div>
        </div>
      )}

      <div className="top-bar">
        <span className="top-bar-title" onClick={handleTitleTap} style={{ cursor: 'default', userSelect: 'none' }}>
          Safe Space
        </span>
        <button onClick={() => setShowCheckin(true)} style={{
          background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8,
          color: 'white', padding: '6px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 600,
        }}>
          ⏱ Check-in
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'chat'    && <AIChat />}
        {activeTab === 'sos'     && <div><SOSButton /><FakePolice /></div>}
        {activeTab === 'journal' && <EvidenceJournal />}
        {activeTab === 'help'    && <div><ResourceFinder /><SelfDefence /></div>}
        {activeTab === 'more'    && <MoreMenu />}
      </div>

      <div className="bottom-nav">
        {tabs.map(tab => (
          <button key={tab.id} className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            <span className="nav-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}