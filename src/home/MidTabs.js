import {
  Dimensions,
  Platform,
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
import HTMLView from 'react-native-htmlview';

const Tab = createMaterialTopTabNavigator();
const {height, width, fontScale} = Dimensions.get('screen');

export default function MidTabs(props) {
  const [expand, setExpand] = useState(false);
  const toggleExpand = () => {
    setExpand(!expand);
  };
  const About = () => {
    return (
      <View style={{padding: 20, flex: 1, paddingBottom: 50}}>
        <View>
          <View>
            {expand ? 
            <View>
              <HTMLView value={detail?.[0]?.about_product} />
              <TouchableOpacity onPress={toggleExpand}>
              <Text style={styles.seeText}>See less</Text>
            </TouchableOpacity>
            </View>
             : 
             <View >
              <HTMLView value={detail?.[0]?.about_product.slice(0, 300)} />
              <TouchableOpacity onPress={toggleExpand}>
              <Text style={styles.seeText}>See More</Text>
            </TouchableOpacity>
            </View>
            }
           
          </View>
          <View style={{marginTop: height * 0.02}}>
            <Button buttonTxt={'Call for more information'} />
          </View>
        </View>
      </View>
    );
  };
  const {detail} = props?.route?.params;
  console.log('DETAILS', detail);
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
      <Tab.Screen name="Reviews" component={Reviews} initialParams={{ detail: detail }} />

    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  text: {
    fontSize: fontScale * 14,
    color: COLORS.black,
    fontFamily: FONTS.Inter400,
    letterSpacing: 0.3,
  },
  seeText: {
    color: COLORS.primary,
    fontSize: fontScale * 13,
    fontFamily: FONTS.Inter400,
    letterSpacing: 0.3,
    top: Platform.OS === 'ios' ? 3 : 5,
  },
});
