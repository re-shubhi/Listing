import React, { createContext, useState, useContext } from 'react';
import { I18nManager } from 'react-native';
import i18n from './i18n';


const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [isRTL, setIsRTL] = useState(I18nManager.isRTL);

  const changeLanguage = (lang) => {
    
    i18n.changeLanguage(lang);

    // Determine if the language is RTL
    const newIsRTL = lang === 'ar';

    // Update the RTL setting if needed
    if (I18nManager.isRTL !== newIsRTL) {
      I18nManager.forceRTL(newIsRTL);
      setIsRTL(newIsRTL);
    }
    
  };

  return (
    <LanguageContext.Provider value={{ changeLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
