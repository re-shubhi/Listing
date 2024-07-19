import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';

const SplashScreen = () => {
  const navigation = useNavigation();

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
            routes: [{name: 'BottomTabNavigation'}],
          }),
        );
      } else if (userStatus != 'registered' && (!token)) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'HomeScreen'}],
          }),
        );
      } else if (userStatus === 'registered' && (!token)) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Login'}],
          }),
        );
      }
    } catch (error) {
      console.error('Error fetching user status:', error);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}],
        }),
      );
    }
  };

  // Effect to handle navigation based on user status
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await checkUserStatus();
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor={COLORS.initial} barStyle={'dark-content'} />
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{...styles.name, color: COLORS.primary}}>L</Text>
          <Text style={styles.name}>isting App</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.initial,
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
