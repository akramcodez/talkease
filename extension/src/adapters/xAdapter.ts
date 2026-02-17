import type { PlatformAdapter } from './base';

export class XAdapter implements PlatformAdapter {
  getMessages(): string[] {
    return [...document.querySelectorAll('[data-testid="messageEntry"]')]
      .map((n) => n.textContent?.trim() ?? '')
      .filter(Boolean);
  }

  injectText(text: string): boolean {
    const input = document.querySelector('[role="textbox"]') as HTMLElement | null;
    if (!input) return false;
    input.focus();
    document.execCommand('insertText', false, text);
    return true;
  }

  send(): boolean {
    const btn = document.querySelector('[data-testid="dmComposerSendButton"]') as HTMLElement | null;
    if (!btn) return false;
    btn.click();
    return true;
  }
}
