import { create } from 'zustand';
import type { Message, Persona, Platform } from '../types/chat';

const MAX_CONTEXT = 20;

interface ChatState {
  platform: Platform;
  sourceLanguage: string;
  targetLanguage: string;
  persona: Persona;
  messages: Message[];
  setPlatform: (platform: Platform) => void;
  setPersona: (persona: Persona) => void;
  addMessage: (message: Message) => void;
  setLanguages: (sourceLanguage: string, targetLanguage: string) => void;
  clear: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  platform: 'unknown',
  sourceLanguage: 'Hindi',
  targetLanguage: 'English',
  persona: 'professional',
  messages: [],
  setPlatform: (platform) => set({ platform }),
  setPersona: (persona) => set({ persona }),
  setLanguages: (sourceLanguage, targetLanguage) => set({ sourceLanguage, targetLanguage }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message].slice(-MAX_CONTEXT)
    })),
  clear: () => set({ messages: [] })
}));
