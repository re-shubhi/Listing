// LayoutContext.js
import React, { createContext, useState, useContext } from 'react';
import { I18nManager, View, Text } from 'react-native';

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [layoutDirection, setLayoutDirection] = useState(I18nManager.isRTL ? 'rtl' : 'ltr');

  const changeLayoutDirection = (isRTL) => {
    I18nManager.forceRTL(isRTL);
    setLayoutDirection(isRTL ? 'rtl' : 'ltr');
  };

  return (
    <LayoutContext.Provider value={{ layoutDirection, changeLayoutDirection }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);
