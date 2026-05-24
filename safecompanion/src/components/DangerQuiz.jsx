import React, { useState } from 'react';

const questions = [
  { q: 'Has the violence been getting worse over time?', weight: 3 },
  { q: 'Does the abuser use or have weapons?', weight: 4 },
  { q: 'Has the abuser threatened to kill you?', weight: 4 },
  { q: 'Have you been strangled or choked?', weight: 4 },
  { q: 'Are there children witnessing the abuse?', weight: 2 },
  { q: 'Does the abuser control your money or movements?', weight: 2 },
  { q: 'Does the abuser stalk or monitor your phone?', weight: 2 },
  { q: 'Do you feel afraid of the abuser most of the time?', weight: 3 },
];

export default function DangerQuiz() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const score = Object.entries(answers)
    .filter(([, v]) => v === 'yes')
    .reduce((sum, [i]) => sum + questions[i].weight, 0);

  const maxScore = questions.reduce((s, q) => s + q.weight, 0);

  const calculate = () => {
    const pct = score / maxScore;
    if (pct >= 0.6) {
      setResult({ level: 'High', color: '#e53e3e', message: 'Your answers suggest you may be in serious danger. Please reach out to SOS Femmes (210 2840) or police (999) today. You deserve to be safe.' });
    } else if (pct >= 0.3) {
      setResult({ level: 'Medium', color: '#ed8936', message: 'Your situation shows concerning warning signs. Consider speaking with a counsellor or trusted person. SOS Femmes can help you plan safely.' });
    } else {
      setResult({ level: 'Lower', color: '#48bb78', message: 'Your answers suggest lower immediate risk, but any level of abuse is serious. Trust your instincts — if something feels wrong, reach out for help.' });
    }
  };

  if (result) {
    return (
      <div>
        <h2 style={styles.title}>📊 Your Safety Check Result</h2>
        <div style={{ ...styles.resultCard, borderLeft: `5px solid ${result.color}` }}>
          <div style={{ ...styles.level, color: result.color }}>Risk Level: {result.level}</div>
          <p style={styles.message}>{result.message}</p>
        </div>
        <a href="tel:210 2840" style={styles.callBtn}>📞 Call SOS Femmes: 210 2840</a>
        <button onClick={() => { setAnswers({}); setResult(null); }} style={styles.resetBtn}>Retake Quiz</button>
        <p style={styles.note}>⚠️ This is not a clinical assessment. Trust your own instincts above all.</p>
      </div>
    );
  }

  const allAnswered = questions.every((_, i) => answers[i]);

  return (
    <div>
      <h2 style={styles.title}>📊 Safety Check</h2>
      <p style={styles.sub}>Answer honestly. This is for your information only — nothing is saved.</p>

      {questions.map((q, i) => (
        <div key={i} style={styles.qCard}>
          <p style={styles.qText}>{q.q}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {['yes', 'no'].map(v => (
              <button key={v} onClick={() => setAnswers({ ...answers, [i]: v })}
                style={{ ...styles.optBtn, ...(answers[i] === v ? styles.optSelected : {}) }}>
                {v === 'yes' ? 'Yes' : 'No'}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button onClick={calculate} disabled={!allAnswered} style={{ ...styles.btn, opacity: allAnswered ? 1 : 0.5 }}>
        See My Result
      </button>
    </div>
  );
}

const styles = {
  title: { fontSize: 20, fontWeight: 600, marginBottom: 8 },
  sub: { fontSize: 14, color: '#718096', marginBottom: 16 },
  qCard: { background: '#fff', borderRadius: 10, padding: 14, marginBottom: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.07)' },
  qText: { fontSize: 15, marginBottom: 10, lineHeight: 1.4 },
  optBtn: { flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f7fafc', cursor: 'pointer', fontSize: 14 },
  optSelected: { background: '#4a5568', color: '#fff' },
  btn: { background: '#4a5568', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', width: '100%', cursor: 'pointer', fontWeight: 600, fontSize: 15 },
  resultCard: { background: '#fff', borderRadius: 12, padding: 16, marginBottom: 16 },
  level: { fontSize: 20, fontWeight: 700, marginBottom: 8 },
  message: { fontSize: 15, lineHeight: 1.6 },
  callBtn: { display: 'block', background: '#e53e3e', color: '#fff', textAlign: 'center', padding: 14, borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: 'none', marginBottom: 8 },
  resetBtn: { background: '#e2e8f0', color: '#4a5568', border: 'none', borderRadius: 8, padding: '10px', width: '100%', cursor: 'pointer', fontSize: 14, marginBottom: 8 },
  note: { fontSize: 12, color: '#a0aec0', textAlign: 'center' },
};