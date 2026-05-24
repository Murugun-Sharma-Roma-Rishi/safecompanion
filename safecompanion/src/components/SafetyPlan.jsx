import React, { useState } from 'react';
import jsPDF from 'jspdf';

const questions = [
  { id: 'children', label: 'Do you have children?', type: 'radio', options: ['Yes', 'No'] },
  { id: 'transport', label: 'Do you have access to a car or bus money?', type: 'radio', options: ['Yes', 'No'] },
  { id: 'finances', label: 'Do you have access to money or a bank account?', type: 'radio', options: ['Yes', 'No'] },
  { id: 'trusted', label: 'Is there a trusted person (friend, family) you can go to?', type: 'radio', options: ['Yes', 'No'] },
  { id: 'documents', label: 'Do you know where your ID/passport is?', type: 'radio', options: ['Yes', 'No'] },
  { id: 'danger', label: 'Is the abuser at home right now?', type: 'radio', options: ['Yes', 'No', 'Not sure'] },
];

export default function SafetyPlan() {
  const [answers, setAnswers] = useState({});
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0); // which question we're on

  const allAnswered = questions.every(q => answers[q.id]);

  const generatePlan = async () => {
    setLoading(true);
    const summary = questions
      .map(q => `${q.label} → ${answers[q.id]}`)
      .join('\n');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Based on this situation, write a clear numbered safety plan (10 steps max) for someone trying to leave an abusive situation safely. Be practical and specific.\n\n${summary}`
          }]
        }),
      });
      const data = await res.json();
      setPlan(data.reply);
    } catch {
      setPlan('Unable to generate plan right now. Please call SOS Femmes: 210 2840 for immediate help.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('My Personal Safety Plan', 20, 20);
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(plan, 170);
    doc.text(lines, 20, 45);
    doc.save('my-safety-plan.pdf');
  };

  if (plan) {
    return (
      <div>
        <h2 style={styles.title}>🛡️ Your Safety Plan</h2>
        <div style={styles.planBox}>
          {plan.split('\n').map((line, i) => (
            <p key={i} style={styles.planLine}>{line}</p>
          ))}
        </div>
        <button onClick={downloadPDF} style={styles.btn}>⬇️ Download as PDF</button>
        <button onClick={() => { setPlan(null); setAnswers({}); setStep(0); }} style={styles.resetBtn}>
          Start Over
        </button>
        <p style={styles.privacy}>📵 This PDF is saved only to your device.</p>
      </div>
    );
  }

  const q = questions[step];

  return (
    <div>
      <h2 style={styles.title}>🛡️ Safety Plan Builder</h2>
      <p style={styles.sub}>Answer {questions.length} quick questions to get your personalised plan.</p>

      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${(step / questions.length) * 100}%` }} />
      </div>
      <p style={styles.progressText}>Question {step + 1} of {questions.length}</p>

      <div style={styles.questionCard}>
        <p style={styles.question}>{q.label}</p>
        {q.options.map(opt => (
          <button
            key={opt}
            onClick={() => {
              setAnswers({ ...answers, [q.id]: opt });
              if (step < questions.length - 1) {
                setStep(step + 1);
              }
            }}
            style={{
              ...styles.optBtn,
              ...(answers[q.id] === opt ? styles.optBtnSelected : {}),
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {allAnswered && (
        <button onClick={generatePlan} style={styles.btn} disabled={loading}>
          {loading ? 'Generating your plan...' : '✨ Generate My Safety Plan'}
        </button>
      )}
    </div>
  );
}

const styles = {
  title: { fontSize: 20, fontWeight: 600, marginBottom: 8 },
  sub: { fontSize: 14, color: '#718096', marginBottom: 16 },
  progressBar: { background: '#e2e8f0', borderRadius: 8, height: 6, marginBottom: 4 },
  progressFill: { background: '#4a5568', height: '100%', borderRadius: 8, transition: 'width 0.3s' },
  progressText: { fontSize: 12, color: '#a0aec0', marginBottom: 16 },
  questionCard: { background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  question: { fontSize: 16, fontWeight: 600, marginBottom: 12, lineHeight: 1.4 },
  optBtn: { display: 'block', width: '100%', padding: '12px', marginBottom: 8, borderRadius: 8, border: '1px solid #e2e8f0', background: '#f7fafc', fontSize: 15, cursor: 'pointer', textAlign: 'left' },
  optBtnSelected: { background: '#4a5568', color: '#fff', borderColor: '#4a5568' },
  btn: { background: '#4a5568', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 15, width: '100%', marginBottom: 8 },
  resetBtn: { background: '#e2e8f0', color: '#4a5568', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontSize: 14, width: '100%' },
  planBox: { background: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', maxHeight: 400, overflowY: 'auto' },
  planLine: { fontSize: 14, lineHeight: 1.6, marginBottom: 6 },
  privacy: { fontSize: 11, color: '#a0aec0', textAlign: 'center', marginTop: 8 },
};