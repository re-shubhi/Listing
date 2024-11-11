import React, { useEffect } from 'react';
import { Image, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { CommonActions, useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import { useTranslation } from 'react-i18next';


const SplashScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  ;
  // Function to check user status and navigate accordingly
  const checkUserStatus = async () => {
    try {
      const userStatus = await AsyncStorage.getItem('userStatus');
      const token = await AsyncStorage.getItem('token');

      if (userStatus === 'registered' && token) {
        // User is logged in
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'BottomTabNavigation' }],
          }),
        );
      } else if (userStatus != 'registered' && !token) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'HomeScreen' }],
          }),
        );
      } else if (userStatus === 'registered' && !token) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          }),
        );
      }
    } catch (error) {
      console.error('Error fetching user status:', error);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        }),
      );
    }
  };

  // Effect to handle navigation based on user status
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setTimeout(async () => {
          await checkUserStatus();
        }, 4000)

      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, [t]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor={COLORS.initial} barStyle={'dark-content'} />
      <View style={styles.container}>
        <Image source={require('../assets/images/pictures/app_Logo.jpg')}
          style={{ height: 500, width: 500 }}
          resizeMode='contain' />
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.yellow,
    justifyContent: 'center',
  },
  container: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 17,
    fontFamily: FONTS.Inter600,
    color: COLORS.black,
  },
  name: {
    fontSize: 38,
    color: '#000000',
    fontFamily: FONTS.Inter600,
  },
});
