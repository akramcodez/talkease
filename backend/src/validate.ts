import type { TranslateRequest } from './types.js';

const validPersona = new Set(['professional', 'casual', 'technical']);
const validDirection = new Set(['inbound', 'outbound']);

export function validateTranslatePayload(input: Partial<TranslateRequest>): { ok: true } | { ok: false; error: string } {
  if (!input.text || input.text.trim().length === 0) return { ok: false, error: 'text is required' };
  if (!input.sourceLanguage) return { ok: false, error: 'sourceLanguage is required' };
  if (!input.targetLanguage) return { ok: false, error: 'targetLanguage is required' };
  if (!input.persona || !validPersona.has(input.persona)) return { ok: false, error: 'persona is invalid' };
  if (!input.direction || !validDirection.has(input.direction)) return { ok: false, error: 'direction is invalid' };
  if (input.contextWindow && !Array.isArray(input.contextWindow)) {
    return { ok: false, error: 'contextWindow must be an array' };
  }

  return { ok: true };
}
