export type Persona = 'professional' | 'casual' | 'technical';

export interface ChatMessage {
  id: string;
  role: 'user' | 'peer';
  text: string;
  timestamp: number;
}

export interface TranslateRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  persona: Persona;
  contextWindow: ChatMessage[];
  direction: 'inbound' | 'outbound';
}
