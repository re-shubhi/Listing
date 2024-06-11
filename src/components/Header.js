import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{paddingVertical: 10}}
      onPress={() => {
        navigation.goBack();
      }}>
      <Image
        source={require('../assets/images/icons/backicon.png')}
        style={{height: 24, width: 24, marginLeft: 10}}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default Header;

const styles = StyleSheet.create({});
