import { createContext, useState, useContext, ReactNode } from 'react';
import { Language, languages, localTranslations } from '@/types';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('english');

  // Using direct import instead of require to avoid linting errors
  const translate = (key: string): string => {
    try {      
      if (localTranslations[key] && localTranslations[key][language]) {
        return localTranslations[key][language];
      }
      
      // Fallback to English if translation is not available
      if (localTranslations[key] && localTranslations[key]['english']) {
        return localTranslations[key]['english'];
      }
      
      return key; // Return the key if no translation is found
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};