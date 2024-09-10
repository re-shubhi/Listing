import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import 'intl-pluralrules';
import { I18nManager } from 'react-native';
import en from '../locales/en.json';
import ar from '../locales/ar.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getInitialLanguage = async () => {
  const language = await AsyncStorage.getItem('languageSelected') ;
  const isRTL = language === 'ar';
  I18nManager.forceRTL(isRTL);
  return language;
};

getInitialLanguage().then((language) => {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        ar: { translation: ar }
      },
      lng: language, // Set initial language
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      },
      pluralSeparator: '_',
      keySeparator: false,
      react: {
        useSuspense: false
      }
    });
});

export default i18n;
