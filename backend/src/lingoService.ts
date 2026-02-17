import type { Persona } from './types.js';

const personaPrefix: Record<Persona, string> = {
  professional: 'Professional tone:',
  casual: 'Casual tone:',
  technical: 'Technical tone:'
};

export class LingoService {
  constructor(private readonly apiKey: string) {}

  async translate(params: {
    text: string;
    sourceLanguage: string;
    targetLanguage: string;
    persona: Persona;
    context: string[];
  }): Promise<string> {
    const { text, sourceLanguage, targetLanguage, persona, context } = params;

    // Placeholder deterministic transformer for local/dev mode.
    // Swap this method with @lingo.dev/sdk call in production.
    const contextHint = context.length > 0 ? ` [ctx:${context.length}]` : '';
    const normalized = text.trim();
    const header = `${personaPrefix[persona]} ${sourceLanguage}→${targetLanguage}${contextHint}`;

    if (this.apiKey === 'demo-key' || this.apiKey.length === 0) {
      return `${header} ${normalized}`;
    }

    return `${header} ${normalized}`;
  }
}
