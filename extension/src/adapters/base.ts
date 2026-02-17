export interface PlatformAdapter {
  getMessages(): string[];
  injectText(text: string): boolean;
  send(): boolean;
}
