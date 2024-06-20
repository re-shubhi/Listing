import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ProfileScreen from '../profile/ProfileScreen';
import HomeScreen from '../home/HomeScreen';
import Notification from '../notification/Notification';
import Heart from '../heart/Wishlist';
import COLORS from '../theme/Colors';
import Wishlist from '../heart/Wishlist';

const BottomTab = createBottomTabNavigator();

function MyTabBar({state, descriptors, navigation}) {
  return (
    <View style={{flexDirection: 'row'}}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        let iconName;
        switch (route.name) {
          case 'HomeScreen':
            iconName = require('../assets/images/icons/home.png');
            break;
          case 'Wishlist':
            iconName = require('../assets/images/icons/heart.png');
            break;
          case 'Notification':
            iconName = require('../assets/images/icons/bell.png');
            break;
          case 'ProfileScreen':
            iconName = require('../assets/images/icons/user.png');
            break;
          default:
            iconName = require('../assets/images/icons/home.png');
            break;
        }

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingBottom: 14,
              backgroundColor: COLORS.white,
              paddingHorizontal: 10,
            }}>
            <View
              style={{
                paddingVertical: 10,
                borderTopWidth: 3,
                paddingHorizontal: 18,
                borderColor: isFocused ? COLORS.primary : 'transparent',
              }}>
              <Image
                source={iconName}
                style={{
                  height: 24,
                  width: 24,
                }}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const BottomTabNavigation = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="ProfileScreen"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <MyTabBar {...props} />}>
      <BottomTab.Screen name="HomeScreen" component={HomeScreen} />
      <BottomTab.Screen name="Wishlist" component={Wishlist} />
      <BottomTab.Screen name="Notification" component={Notification} />
      <BottomTab.Screen name="ProfileScreen" component={ProfileScreen} />
    </BottomTab.Navigator>
  );
};

export default BottomTabNavigation;

const styles = StyleSheet.create({});
