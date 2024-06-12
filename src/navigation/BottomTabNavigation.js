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
import Chat from '../chat/Chat';
import Heart from '../heart/Heart';
import COLORS from '../theme/Colors';

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
          case 'Heart':
            iconName = require('../assets/images/icons/heart.png');
            break;
          case 'Chat':
            iconName = require('../assets/images/icons/chat.png');
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
              backgroundColor:COLORS.white,
              paddingHorizontal:10
            }}>
            <View
              style={{
                paddingVertical: 10,
                borderTopWidth: 2,
                paddingHorizontal: 18,
                borderColor: isFocused ? COLORS.primary : "transparent"
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
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <MyTabBar {...props} />}>
      <BottomTab.Screen
        name="HomeScreen"
        component={HomeScreen}
        // options={{
        //   tabBarShowLabel: false,
        //   tabBarButton: () => {
        //     return (
        //       <View
        //         style={{
        //           backgroundColor: 'red',
        //           paddingHorizontal: 20,
        //           paddingVertical: 20,
        //         }}>
        //         <Pressable>
        //           <Image
        //             source={require('../assets/images/icons/home.png')}
        //             style={{height: 24, width: 24}}
        //             resizeMode="contain"
        //           />
        //         </Pressable>
        //       </View>
        //     );
        //   },
        // }}
      />
      <BottomTab.Screen name="Heart" component={Heart} />
      <BottomTab.Screen name="Chat" component={Chat} />
      <BottomTab.Screen name="ProfileScreen" component={ProfileScreen} />
    </BottomTab.Navigator>
  );
};

export default BottomTabNavigation;

const styles = StyleSheet.create({});
