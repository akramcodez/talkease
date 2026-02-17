import type { Platform } from '../types/chat';
import type { PlatformAdapter } from './base';
import { DiscordAdapter } from './discordAdapter';
import { TelegramAdapter } from './telegramAdapter';
import { WhatsAppAdapter } from './whatsappAdapter';
import { XAdapter } from './xAdapter';

export function createAdapter(platform: Platform): PlatformAdapter | null {
  switch (platform) {
    case 'whatsapp':
      return new WhatsAppAdapter();
    case 'x':
      return new XAdapter();
    case 'discord':
      return new DiscordAdapter();
    case 'telegram':
      return new TelegramAdapter();
    default:
      return null;
  }
}
