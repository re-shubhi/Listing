import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import EditProfile from '../profile/EditProfile';
import MapScreen from '../home/MapScreen';
import GridImageView from '../home/GridImageView';
import VerifyOtp from '../auth/VerifyOtp';
import IntroductionScreen from '../home/Introduction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '../home/HomeScreen';
import ReviewListing from '../home/ReviewListing';

const Stack = createNativeStackNavigator();

const Navigation = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={"SplashScreen"}
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="BottomTabNavigation"
          component={BottomTabNavigation}
        />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen
          name="IntroductionScreen"
          component={IntroductionScreen}
        />
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="Categories" component={Categories} />
        <Stack.Screen
          name="ParticularCategory"
          component={ParticularCategory}
        />
        <Stack.Screen name="DetailScreen" component={DetailScreen} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
        <Stack.Screen name="GridImageView" component={GridImageView} />
        <Stack.Screen name="ReviewListing" component={ReviewListing} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
