import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Navigation from './src/navigation/Navigation';
import FlashMessage from 'react-native-flash-message';
import {AuthContext, AuthContextProvider} from './src/restapi/AuthContext';

const App = () => {
  return (
    <>
      <AuthContextProvider>
        <Navigation />
        <FlashMessage position="top" />
      </AuthContextProvider>
    </>
  );
};

export default App;
