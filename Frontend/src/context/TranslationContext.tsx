import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Translation = Record<string, any>;
type Language = 'en' | 'fr' | 'douala' | 'bassa' | 'ewondo';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translation>({});

  
  useEffect(() => {
  const loadTranslations = async () => {
    try {
      const response = await fetch(`/locales/${language}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${language} translations`);
      }
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error('Failed to load translations:', error);

      // Fallback to English if translation file fails to load
      if (language !== 'en') {
        try {
          const fallbackResponse = await fetch('/locales/en.json');
          const fallbackData = await fallbackResponse.json();
          setTranslations(fallbackData);
        } catch (fallbackError) {
          console.error('Failed to load fallback (English) translations:', fallbackError);
        }
      }
    }
  };

  loadTranslations();
}, [language]);


  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        const englishValue = getEnglishValue(key);
        return englishValue || key; // Return the key itself if not found in English
      }
    }
    
    return value || key;
  };

  const getEnglishValue = (key: string): string => {
    if (language === 'en') return key; // Already checking English
    
    const keys = key.split('.');
    let value: any = require('../locales/en.json');
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return value;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};