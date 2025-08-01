// Define the types for our application

export type Language = 'english' | 'french' | 'fufulde' | 'ewondo';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TranslationKeys {
  welcomeMessage: string;
  chatPlaceholder: string;
  sendButton: string;
  recordButton: string;
  stopRecordingButton: string;
  languageSelector: string;
  newChatButton: string;
  historyTitle: string;
  settingsTitle: string;
  aboutTitle: string;
  disclaimerText: string;
  loadingText: string;
}

export interface Translations {
  english: TranslationKeys;
  french: TranslationKeys;
  fufulde: TranslationKeys;
  ewondo: TranslationKeys;
}