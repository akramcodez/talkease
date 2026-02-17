import { useMemo, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { translateMessage } from '../services/api';

export function SidePanel() {
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const { messages, persona, platform, sourceLanguage, targetLanguage, addMessage, setPersona } = useChatStore();

  const contextPreview = useMemo(() => messages.slice(-3), [messages]);

  const sendReply = async () => {
    if (!draft.trim()) return;
    setBusy(true);
    try {
      const translated = await translateMessage({
        text: draft,
        sourceLanguage,
        targetLanguage,
        persona,
        contextWindow: messages,
        direction: 'outbound'
      });

      addMessage({
        id: crypto.randomUUID(),
        role: 'user',
        text: draft,
        translated,
        timestamp: Date.now()
      });

      setDraft('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel">
      <header>
        <h1>LingoMate</h1>
        <p>{platform.toUpperCase()} • Side-Car Active</p>
      </header>

      <section className="controls">
        <label>
          Persona
          <select value={persona} onChange={(e) => setPersona(e.target.value as typeof persona)}>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="technical">Technical</option>
          </select>
        </label>
      </section>

      <section className="messages">
        {messages.length === 0 && <p className="empty">No translated messages yet.</p>}
        {messages.map((message) => (
          <article key={message.id} className="message">
            <strong>{message.role === 'user' ? 'You' : 'Peer'}</strong>
            <p>{message.text}</p>
            {message.translated && <small>{message.translated}</small>}
          </article>
        ))}
      </section>

      <section className="context">
        <h2>Context Window ({messages.length}/20)</h2>
        {contextPreview.map((m) => (
          <p key={m.id}>{m.text}</p>
        ))}
      </section>

      <footer>
        <textarea
          placeholder="Type in your native language..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button onClick={sendReply} disabled={busy}>
          {busy ? 'Translating…' : 'Translate & Send'}
        </button>
      </footer>
    </div>
  );
}
