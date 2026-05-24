import React, { useState, useRef, useEffect } from 'react';

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi, I'm here for you. Everything you share stays on your device. What's on your mind?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll to newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Only send the last 10 messages (to keep it within API limits)
      const recentMessages = newMessages.slice(-10);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: recentMessages }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting. If you're in danger, please call 999."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            ...styles.bubble,
            ...(msg.role === 'user' ? styles.userBubble : styles.aiBubble),
          }}>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div style={styles.aiBubble}>
            <span style={styles.typing}>● ● ●</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={styles.inputArea}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type here... (Enter to send)"
          style={styles.textarea}
          rows={2}
        />
        <button onClick={sendMessage} style={styles.sendBtn} disabled={loading}>
          Send
        </button>
      </div>

      <p style={styles.privacy}>🔒 This conversation is not saved to any server.</p>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100%' },
  messages: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16 },
  bubble: { maxWidth: '80%', padding: '10px 14px', borderRadius: 14, fontSize: 15, lineHeight: 1.5 },
  userBubble: { alignSelf: 'flex-end', background: '#4a5568', color: '#fff', borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: 'flex-start', background: '#fff', color: '#2d3748', border: '1px solid #e2e8f0', borderBottomLeftRadius: 4 },
  typing: { letterSpacing: 4, color: '#a0aec0' },
  inputArea: { display: 'flex', gap: 8, marginTop: 8 },
  textarea: { flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 15, resize: 'none', fontFamily: 'inherit' },
  sendBtn: { padding: '0 18px', background: '#4a5568', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600 },
  privacy: { fontSize: 11, color: '#a0aec0', textAlign: 'center', marginTop: 6 },
};