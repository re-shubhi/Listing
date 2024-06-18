import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import FONTS from '../theme/Fonts';
import COLORS from '../theme/Colors';
import MidTabs from './MidTabs';

const {height, width, fontScale} = Dimensions.get('screen');

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Reviews from './Reviews';
import About from './About';

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
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

const DetailScreen = () => {
  const [scrollY] = useState(new Animated.Value(0));
  const HEADER_MAX_HEIGHT = 290;
  const HEADER_MIN_HEIGHT = Platform.OS == 'ios' ? 100 : height * 0.07;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  //header Hieght
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });
  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  return (
    <View stye={styles.screen}>
      <Animated.View style={[styles.header, {height: headerHeight}]}>
        <Animated.Image
          style={[
            styles.backgroundImage,
            {
              opacity: imageOpacity,
              transform: [{translateY: imageTranslate}],
            },
          ]}
          source={require('../assets/images/pictures/slider.png')}
        />
      </Animated.View>
      <ScrollView
      // onScroll={Animated.event([
      //   {nativeEvent: {contentOffset: {y: scrollY}}},

      // ])}
      // scrollEventThrottle={16}
      >
        <View style={styles.scrollViewContent}>
          <View style={styles.container}>
            <View style={{rowGap: 4}}>
              <Text style={styles.heading}>Moor Mall</Text>
              <Text style={styles.address}>Ferry Road ,Maidenhead</Text>
              <View style={{flexDirection: 'row', columnGap: 5}}>
                <Image
                  source={require('../assets/images/icons/star2.png')}
                  style={{height: 16, width: 16}}
                  resizeMode="contain"
                />
                <Text style={styles.rate}>4.5</Text>
              </View>
            </View>
            <View style={styles.distanceCont}>
              <Text
                style={[
                  styles.heading,
                  {color: COLORS.white, fontSize: fontScale * 15},
                ]}>
                1.5 Km
              </Text>
            </View>
          </View>
          <View style={styles.mapsContent}>
            <Image
              source={require('../assets/images/pictures/map.png')}
              style={{
                height: 90,
                width: 90,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: 'gray',
              }}
              resizeMode="contain"
            />
            <View>
              <Text style={[styles.address, {fontSize: fontScale * 16}]}>
                Ferry Road ,Maidenhead
              </Text>
              <TouchableOpacity>
                <Text
                  style={[
                    styles.heading,
                    {color: COLORS.primary, paddingTop: 5},
                  ]}>
                  Open on maps
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
          <MidTabs />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    zIndex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: 290,
    resizeMode: 'cover',
  },
  scrollViewContent: {
    marginTop: 290,
  },
  rate: {
    fontSize: fontScale * 15,
    lineHeight: 19,
    fontFamily: FONTS.Inter400,
    color: COLORS.base,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.02,
    borderBottomWidth: 0.5,
    borderColor: 'gray',
    marginHorizontal: 12,
  },
  heading: {
    fontSize: fontScale * 17,
    fontFamily: FONTS.Inter600,
    lineHeight: 19,
    color: COLORS.base,
  },
  address: {
    fontSize: fontScale * 15,
    lineHeight: 19,
    fontFamily: FONTS.Inter400,
    color: COLORS.base,
  },
  distanceCont: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginVertical: 15,
    borderRadius: 30,
  },
  mapsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    paddingLeft: width * 0.05,
    paddingVertical: height * 0.02,
  },
});
