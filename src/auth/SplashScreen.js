import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, { useEffect } from 'react';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
const navigation = useNavigation();

//timeout to navigate LoginScreen
useEffect(()=>{
  const timer = setTimeout(()=>{
    navigation.navigate("Login");
  },4000)
  return () => clearTimeout(timer)
},[navigation]);

  return (
    <SafeAreaView style={styles.screen}>
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
