export type Persona = 'professional' | 'casual' | 'technical';
export type Platform = 'whatsapp' | 'x' | 'discord' | 'telegram' | 'unknown';

export interface Message {
  id: string;
  role: 'user' | 'peer';
  text: string;
  timestamp: number;
  translated?: string;
}
