import axios from 'axios';
import { TRANSLATION_API_URL, LANGUAGE_CODES } from './apiConfig';
import { Language } from '@/types';

// Interface for the translation request
interface TranslationRequest {
  q: string;
  source: string;
  target: string;
}

// Interface for the translation response
interface TranslationResponse {
  translatedText: string;
}

// Service for language translation
export const translationService = {
  /**
   * Translate text to the target language
   * @param text Text to translate
   * @param targetLang Target language
   * @param sourceLang Source language (defaults to English)
   * @returns Translated text
   */
  async translate(
    text: string,
    targetLang: Language,
    sourceLang: Language = 'english'
  ): Promise<string> {
    try {
      // Skip translation if source and target are the same
      if (sourceLang === targetLang) {
        return text;
      }

      // Get language codes for the API
      const sourceCode = LANGUAGE_CODES[sourceLang];
      const targetCode = LANGUAGE_CODES[targetLang];

      // Make API request
      const response = await axios.post<TranslationResponse>(
        TRANSLATION_API_URL,
        {
          q: text,
          source: sourceCode,
          target: targetCode,
        } as TranslationRequest,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      return response.data.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      
      // Return original text if translation fails
      return text;
    }
  }
};