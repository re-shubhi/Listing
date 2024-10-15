// services/translationService.js
import axios from 'axios';

const API_KEY = 'AIzaSyCHlWzE8PGnZwyPbi2-EgZe3EcYgZ_g5dE'; // Replace with your actual API key
const API_URL = 'https://translation.googleapis.com/language/translate/v2';

// Simple in-memory cache
const cache = new Map();

export const translateText = async (text, targetLanguage) => {
  const cacheKey = `${text}_${targetLanguage}`;
  const cachedTranslation = await getCachedTranslation(cacheKey);

  if (cachedTranslation) {
    return cachedTranslation;
  }

  try {
    const response = await axios.post(API_URL, null, {
      params: {
        q: text,
        target: targetLanguage,
        key: API_KEY,
      },
    });
    const translation = response.data.data.translations[0].translatedText;
    await cacheTranslation(cacheKey, translation);
    return translation;
  } catch (error) {
    console.error('Error translating text:', error);
    throw new Error('Failed to translate text');
  }
};

// Implement caching functions
const getCachedTranslation = async (key) => {
  return cache.get(key) || null;
};

const cacheTranslation = async (key, translation) => {
  cache.set(key, translation);
};
