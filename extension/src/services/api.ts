import type { Message, Persona } from '../types/chat';

const API_BASE = 'http://localhost:8787';

export async function translateMessage(params: {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  persona: Persona;
  contextWindow: Message[];
  direction: 'inbound' | 'outbound';
}): Promise<string> {
  const response = await fetch(`${API_BASE}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    throw new Error('Translation failed');
  }

  const data = (await response.json()) as { translated: string };
  return data.translated;
}
