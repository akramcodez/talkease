import { useEffect, useMemo, useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { translateMessage } from '../services/api';

async function getActiveTabId(): Promise<number | null> {
  if (!('chrome' in window) || !chrome.tabs) return null;

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0]?.id ?? null;
}

export function SidePanel() {
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('Standby');
  const seenInbound = useRef(new Set<string>());

  const { messages, persona, platform, sourceLanguage, targetLanguage, addMessage, setPersona } = useChatStore();
  const contextPreview = useMemo(() => messages.slice(-3), [messages]);

  useEffect(() => {
    let timer: number | undefined;

    const syncInbound = async () => {
      try {
        const tabId = await getActiveTabId();
        if (!tabId || !chrome.tabs) {
          setStatus('Standby');
          return;
        }

        chrome.tabs.sendMessage(tabId, { type: 'LINGOMATE_EXTRACT_MESSAGES' }, async (response) => {
          const incoming = (response?.messages ?? []) as string[];
          if (incoming.length === 0) {
            setStatus('Standby');
            return;
          }

          setStatus('Active');
          for (const text of incoming.slice(-5)) {
            if (seenInbound.current.has(text)) continue;
            seenInbound.current.add(text);

            const translated = await translateMessage({
              text,
              sourceLanguage: targetLanguage,
              targetLanguage: sourceLanguage,
              persona,
              contextWindow: messages,
              direction: 'inbound'
            });

            addMessage({
              id: crypto.randomUUID(),
              role: 'peer',
              text,
              translated,
              timestamp: Date.now()
            });
          }
        });
      } catch {
        setStatus('Standby');
      }
    };

    timer = window.setInterval(syncInbound, 2200);
    void syncInbound();

    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [addMessage, messages, persona, sourceLanguage, targetLanguage]);

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

      const tabId = await getActiveTabId();
      if (tabId && chrome.tabs) {
        chrome.tabs.sendMessage(tabId, { type: 'LINGOMATE_INJECT', text: translated });
      }

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
        <p>
          {platform.toUpperCase()} • {status}
        </p>
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
