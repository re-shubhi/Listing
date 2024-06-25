import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, { useEffect } from 'react';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import { CommonActions, useNavigation } from '@react-navigation/native';

const SplashScreen = (props) => {
const navigation = useNavigation();

//timeout to navigate LoginScreen
useEffect(() => {
  const timer = setTimeout(() => {
    props?.navigation?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }]  
      })
    );
  }, 2000);

  return () => clearTimeout(timer);
}, [props.navigation]);  // Fixed dependency array to include props.navigation


  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor={COLORS.initial} barStyle={'dark-content'}/>
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
    color: '#00000',
    fontFamily: FONTS.Inter600,
  },
});
