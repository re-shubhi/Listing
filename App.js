import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Navigation from './src/navigation/Navigation';
import FlashMessage from 'react-native-flash-message';
import { AuthContextProvider } from './src/restapi/AuthContext';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';


const App = () => {
  return (
    <>
    <AutocompleteDropdownContextProvider>
      <AuthContextProvider>
        <Navigation />
        <FlashMessage position="top" />
      </AuthContextProvider>
      </AutocompleteDropdownContextProvider>
    </>
  );
};

export default App;
