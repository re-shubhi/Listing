import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Navigation from './src/navigation/Navigation';
import FlashMessage from 'react-native-flash-message';

const App = () => {
  return (
    <>
      <FlashMessage position="bottom" />
      <Navigation />
    </>
  );
};

export default App;
