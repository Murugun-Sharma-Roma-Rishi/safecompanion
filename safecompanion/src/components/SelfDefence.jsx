import React, { useState } from 'react';

const tips = [
  {
    title: 'Create distance immediately',
    body: 'Your safest move is always to create space and run. Distance = safety. Never try to fight if escape is possible.',
    icon: '🏃',
  },
  {
    title: 'Target vulnerable areas',
    body: 'If grabbed: eyes (palm strike or finger jab), nose (upward palm strike), throat (chop), groin (knee strike). One decisive strike, then run.',
    icon: '🎯',
  },
  {
    title: 'Wrist grab escape',
    body: 'Rotate your wrist toward their thumb (the weakest point of their grip). Pull sharply and step back simultaneously.',
    icon: '✊',
  },
  {
    title: 'Bear hug from behind',
    body: 'Drop your weight suddenly by bending knees. Stomp hard on their foot. Throw your head back into their face. Then run.',
    icon: '💪',
  },
  {
    title: 'Use your voice',
    body: 'Yell "FIRE" not "Help" — people respond faster to fire. Your voice can attract attention and startle an attacker.',
    icon: '📢',
  },
  {
    title: 'Everyday objects as tools',
    body: 'Keys between fingers, phone as impact weapon, handbag to block, hot drinks, umbrella point. Anything creates distance.',
    icon: '🔑',
  },
  {
    title: 'De-escalation first',
    body: 'Calm voice, hands visible, don\'t challenge ego. "I don\'t want trouble, I\'m leaving now." Make it easy for them to let you go.',
    icon: '🕊️',
  },
  {
    title: 'Situational awareness',
    body: 'Scan exits when entering a space. Walk away from potential threats early — trust your gut. Prevention beats reaction every time.',
    icon: '👁️',
  },
];

export default function SelfDefence() {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ marginTop: 16 }}>
      <p className="section-title">🥋 Self-Defence Tips</p>
      <p className="section-sub">Tap any tip to expand. Your safety always comes first.</p>
      {tips.map((tip, i) => (
        <div key={i} className="card" style={{ cursor: 'pointer' }} onClick={() => setOpen(open === i ? null : i)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 15 }}>{tip.icon} {tip.title}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>{open === i ? '−' : '+'}</span>
          </div>
          {open === i && (
            <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.7, color: 'var(--text-muted)' }}>{tip.body}</p>
          )}
        </div>
      ))}
    </div>
  );
}