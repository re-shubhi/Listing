import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Reviews from './Reviews';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FONTS from '../theme/Fonts';
import COLORS from '../theme/Colors';
import Button from '../components/Button';

const Tab = createMaterialTopTabNavigator();
const {height, width, fontScale} = Dimensions.get('screen');

let description =
  'Lorem Ipsum is simply dummy text of the printing and typesetting ' +
  "industry. Lorem Ipsum has been the industry's standard dummy text ever " +
  'since the 1500s, when an unknown printer took a galley of type and ' +
  'scrambled it to make a type specimen book. Lorem Ipsum is simply dummy ' +
  'text of the printing and typesetting industry. Lorem Ipsum has been ' +
  "the industry's standard dummy text ever since the 1500s, when an " +
  'unknown printer took a galley of type and scrambled it to make a type ' +
  'specimen book.';

export default function MidTabs() {
  const [expand, setExpand] = useState(false);
  const toggleExpand = () => {
    setExpand(!expand);
  };
  const About = () => {
    return (
      <View style={{padding: 20, flex: 1, paddingBottom: 50}}>
        <View>
          <View>
            <Text style={styles.text}>
              {expand ? description : description.slice(0, 300)}
              {expand ? (
                <TouchableOpacity onPress={toggleExpand}>
                  <Text style={styles.seeText}>See less</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={toggleExpand}>
                  <Text style={styles.seeText}>See More</Text>
                </TouchableOpacity>
              )}
            </Text>
          </View>

          <View style={{marginTop: height * 0.02}}>
            <Button buttonTxt={'Call for more information'} />
          </View>
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
    letterSpacing: 0.3,
   
  },
  seeText: {
    color: COLORS.primary,
    fontSize: fontScale * 15,
    fontFamily: FONTS.Inter400,
    letterSpacing: 0.3,
    top:3
  },
});
