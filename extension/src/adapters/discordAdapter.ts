import type { PlatformAdapter } from './base';

export class DiscordAdapter implements PlatformAdapter {
  getMessages(): string[] {
    return [...document.querySelectorAll('[aria-label*="Message"]')].map((n) => n.textContent?.trim() ?? '').filter(Boolean);
  }

  injectText(text: string): boolean {
    const input = document.querySelector('[role="textbox"]') as HTMLElement | null;
    if (!input) return false;
    input.focus();
    document.execCommand('insertText', false, text);
    return true;
  }

  send(): boolean {
    const form = document.querySelector('form');
    if (!form) return false;
    form.dispatchEvent(new Event('submit', { bubbles: true }));
    return true;
  }
}
