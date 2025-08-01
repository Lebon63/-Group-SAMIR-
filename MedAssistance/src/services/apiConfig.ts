// API Configuration for model and translation services

// For BioMistral model API
// In a real production environment, you would store this in environment variables
export const MODEL_API_URL = "https://api.huggingface.co/models/BioMistral/BioMistral-7B-DARE";

// LibreTranslate API - we're using a public instance
// In production, you might want to self-host or use a paid service
export const TRANSLATION_API_URL = "https://libretranslate.com/translate";

// Supported languages in our application with their translation API codes
export const LANGUAGE_CODES = {
  english: "en",
  french: "fr",
  fufulde: "ff",  // Note: Fulfulde support might be limited on free translation APIs
  ewondo: "ln"    // Using Lingala as closest available for Ewondo on most free APIs
};