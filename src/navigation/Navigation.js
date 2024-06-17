import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from '../auth/SplashScreen';
import Login from '../auth/Login';
import ForgotPassword from '../auth/ForgotPassword';
import Register from '../auth/Register';
import BottomTabNavigation from './BottomTabNavigation';
import OtpScreen from '../auth/OtpScreen';
import ResetPassword from '../auth/ResetPassword';
import Categories from '../home/Categories';
import ParticularCategory from '../home/ParticularCategory';
import DetailScreen from '../home/DetailScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Categories"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="BottomTabNavigation" component={BottomTabNavigation} />
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="Categories" component={Categories} />
        <Stack.Screen name="ParticularCategory" component={ParticularCategory} />
        <Stack.Screen name="DetailScreen" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
