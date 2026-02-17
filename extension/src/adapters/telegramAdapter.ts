import type { PlatformAdapter } from './base';

export class TelegramAdapter implements PlatformAdapter {
  getMessages(): string[] {
    return [...document.querySelectorAll('.message, .text-content')].map((n) => n.textContent?.trim() ?? '').filter(Boolean);
  }

  injectText(text: string): boolean {
    const input = document.querySelector('[contenteditable="true"]') as HTMLElement | null;
    if (!input) return false;
    input.focus();
    document.execCommand('insertText', false, text);
    return true;
  }

  send(): boolean {
    const btn = document.querySelector('button[aria-label="Send"]') as HTMLElement | null;
    if (!btn) return false;
    btn.click();
    return true;
  }
}
