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
  { id: 'chat',     label: 'Chat',    icon: '💬' },
  { id: 'sos',      label: 'SOS',     icon: '🆘' },
  { id: 'journal',  label: 'Journal', icon: '📝' },
  { id: 'help',     label: 'Help',    icon: '📞' },
  { id: 'more',     label: 'More',    icon: '⋯'  },
];

export default function MainApp({ onExit }) {
  const [activeTab, setActiveTab] = useState('chat');
  const [moreOpen, setMoreOpen] = useState(false);
  const tapCount = useRef(0);
  const tapTimer = useRef(null);

  // Hidden exit: triple-tap the top bar title
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
      <div className="top-bar">
        <span
          className="top-bar-title"
          onClick={handleTitleTap}
          style={{ cursor: 'default', userSelect: 'none' }}
        >
          Safe Space
        </span>
        <CheckIn compact />
      </div>

      <div className="tab-content">
        {activeTab === 'chat'    && <AIChat />}
        {activeTab === 'sos'     && (
          <div>
            <SOSButton />
            <FakePolice />
          </div>
        )}
        {activeTab === 'journal' && <EvidenceJournal />}
        {activeTab === 'help'    && (
          <div>
            <ResourceFinder />
            <SelfDefence />
          </div>
        )}
        {activeTab === 'more'    && (
          <div>
            <DangerQuiz />
            <SafetyPlan />
          </div>
        )}
      </div>

      <div className="bottom-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="nav-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}