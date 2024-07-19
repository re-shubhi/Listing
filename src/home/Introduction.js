import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';

const IntroductionScreen = ({ navigation }) => {

  useEffect(() => {
    AsyncStorage.getItem('hasSeenIntroduction').then((value) => {
      if (value === 'true') {
        navigation.navigate('Login');
      }
    });
  }, []);

  const continueAsGuest = () => {
    AsyncStorage.setItem('hasSeenIntroduction', 'true');
    navigation.navigate('GuestHomeScreen');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to our App!</Text>
      <Text>Discover amazing features by signing up.</Text>
      <Button
        title="Continue as Guest"
        onPress={continueAsGuest}
      />
    </View>
  );
};

export default IntroductionScreen;
