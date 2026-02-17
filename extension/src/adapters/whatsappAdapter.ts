import type { PlatformAdapter } from './base';

export class WhatsAppAdapter implements PlatformAdapter {
  getMessages(): string[] {
    return [...document.querySelectorAll('div._amk4')].map((n) => n.textContent?.trim() ?? '').filter(Boolean);
  }

  injectText(text: string): boolean {
    const input = document.querySelector('div[contenteditable="true"]') as HTMLElement | null;
    if (!input) return false;
    input.focus();
    document.execCommand('insertText', false, text);
    return true;
  }

  send(): boolean {
    const btn = document.querySelector('[data-icon="send"]') as HTMLElement | null;
    if (!btn) return false;
    btn.click();
    return true;
  }
}
