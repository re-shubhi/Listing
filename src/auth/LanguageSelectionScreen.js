import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {I18nManager} from 'react-native';
import i18n from '../../services/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageSelectionScreen = () => {
  const navigation = useNavigation();

  const changeLanguage = async (lang) => {
    i18n.changeLanguage(lang);
    const isRTL = lang === 'ar';

    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
      await AsyncStorage.setItem('languageSelected', lang);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }],
        }),
      );
    } else {
      await AsyncStorage.setItem('languageSelected', lang);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }],
        }),
      );
    }
  };
  


  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Select Language</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => changeLanguage('en')}>
          <Text style={styles.buttonText}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => changeLanguage('ar')}>
          <Text style={styles.buttonText}>العربية (Arabic)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    margin: 10,
    borderRadius: 5,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default LanguageSelectionScreen;
