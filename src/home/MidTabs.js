import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Reviews from './Reviews';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FONTS from '../theme/Fonts';
import COLORS from '../theme/Colors';
import Button from '../components/Button';

const Tab = createMaterialTopTabNavigator();
const {height, width, fontScale} = Dimensions.get('screen');

export default function MidTabs() {
  const About = () => {
    return (
      <View style={{backgroundColor: '#fff', padding: 20}}>
        <Text style={styles.text}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. Lorem Ipsum is simply dummy
          text of the printing and typesetting industry. Lorem Ipsum has been
          the industry's standard dummy text ever since the 1500s, when an
          unknown printer took a galley of type and scrambled it to make a type
          specimen book. Read more
        </Text>
        <View style={{marginTop: height * 0.02}}>
          <Button buttonTxt={'Call for more information'} />
        </View>
      </View>
    );
  };
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarInactiveTintColor: COLORS.base,
        tabBarActiveTintColor: COLORS.primary,

        tabBarLabelStyle: {
          textTransform: 'capitalize',
          fontSize: fontScale * 15,
          fontFamily: FONTS.Inter500,
        },

        tabBarStyle: {
          backgroundColor: '#F7F7F7',
          elevation: 0,
        },
        tabBarIndicatorStyle: {
          backgroundColor: COLORS.primary, // Set the color of the indicator
          height: 3,
        },
      }}>
      <Tab.Screen name="About" component={About} />
      <Tab.Screen name="Reviews" component={Reviews} />
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  text: {
    fontSize: fontScale * 15,
    color: COLORS.black,
    fontFamily: FONTS.Inter400,
  },
});
