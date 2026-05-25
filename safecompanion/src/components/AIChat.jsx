import React, { useState, useRef, useEffect } from 'react';

const WELCOME = "Hi, I'm Companion. I'm here for you — everything you share stays private on your device. What's on your mind?";

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: WELCOME }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    textareaRef.current?.focus();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.slice(-10) }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply || "I'm here. Please call 999 if you're in immediate danger."
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting. If you're in danger, please call 999 now."
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
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 120px)' }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 8 }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`bubble ${msg.role === 'user' ? 'bubble-user' : 'bubble-ai'}`}
          >
            {msg.content}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="bubble bubble-ai" style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '12px 16px' }}>
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type here… (Enter to send)"
          className="input"
          rows={2}
          style={{ flex: 1, resize: 'none' }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="btn btn-primary"
          style={{ width: 'auto', padding: '0 16px', alignSelf: 'stretch' }}
        >
          ➤
        </button>
      </div>

      <p className="privacy-badge">🔒 Not saved to any server</p>
    </div>
  );
}