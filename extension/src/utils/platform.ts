import type { Platform } from '../types/chat';

export function detectPlatform(hostname: string): Platform {
  if (hostname.includes('whatsapp')) return 'whatsapp';
  if (hostname === 'x.com' || hostname.includes('twitter')) return 'x';
  if (hostname.includes('discord')) return 'discord';
  if (hostname.includes('telegram')) return 'telegram';
  return 'unknown';
}
