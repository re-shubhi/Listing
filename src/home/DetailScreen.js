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
import React, {useEffect, useState} from 'react';
import FONTS from '../theme/Fonts';
import COLORS from '../theme/Colors';
import MidTabs from './MidTabs';

const {height, width, fontScale} = Dimensions.get('screen');

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Reviews from './Reviews';
import About from './About';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Header from '../components/Header';
import axios from 'axios';
import {productDetails} from '../restapi/ApiConfig';
import ScreenLoader from '../components/ScreenLoader';

const Tab = createMaterialTopTabNavigator();

const DetailScreen = props => {
  const navigation = useNavigation();
  const isfocus = useIsFocused();
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
  const {data} = props?.route?.params;
  console.log('category_id', data);
  const [detail, setDetail] = useState([]);
  const [loader, setLoader] = useState(false);

  //Detail Product Api

  const ProductDetail = async () => {
    try {
      setLoader(true);
      const response = await axios({
        method: 'POST',
        url: productDetails,
        data: {
          id: data,
        },
      });
      console.log('Details---', response);
      if (response?.data?.status === true) {
        setLoader(false);
        setDetail(response?.data?.data);
      }
    } catch (error) {
      console.log('error Detail', error?.response);
      setLoader(false);
    }
  };
  console.log('00000', detail?.[0]?.category);

  useEffect(() => {
    ProductDetail();
  }, [isfocus]);

  return (
    <View style={styles.screen}>
      <Animated.View style={[styles.header, {height: headerHeight}]}>
        <Animated.Image
          style={[
            styles.backgroundImage,
            {
              opacity: imageOpacity,
              transform: [{translateY: imageTranslate}],
            },
          ]}
          source={{uri: detail?.[0]?.image}}
        />
        <Animated.View style={{marginTop: 35}}>
          <Header backicon={true} tintColor={COLORS.white} />
        </Animated.View>
        <Animated.View style={{marginTop: Platform.OS === 'ios' ? 225 : 190}}>
          <View />
          <TouchableOpacity
            style={styles.Btn}
            onPress={() => props.navigation.navigate('GridImageView', {data:detail?.[0]?.galleryData})}>
            <Image
              resizeMode="contain"
              style={{height: 15, width: 15}}
              source={require('../assets/images/icons/imgIcon.png')}
            />
            <Text style={{color: '#000', fontWeight: '800'}}>{detail?.[0]?.galleryData.length}</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
      <ScrollView
        onScroll={Animated.event([
          {nativeEvent: {contentOffset: {y: scrollY}}},
        ])}
        scrollEventThrottle={16}
        contentContainerStyle={{flexGrow: 1, marginBottom: 40}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.scrollViewContent}>
          <View style={styles.container}>
            <View style={{rowGap: 4, width: width * 0.65}}>
              <Text style={styles.heading}>{detail?.[0]?.title}</Text>
              <Text style={styles.address}>{detail?.[0]?.address}</Text>
              <View style={{flexDirection: 'row', columnGap: 5, paddingTop: 5}}>
                <Image
                  source={require('../assets/images/icons/star2.png')}
                  style={{height: 16, width: 16}}
                  resizeMode="contain"
                />
                <Text style={styles.rate}>{detail?.[0]?.rating}</Text>
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
                borderColor: COLORS.cardsBorderColor,
              }}
              resizeMode="contain"
            />
            <View style={{width: width * 0.6}}>
              <Text style={[styles.address, {fontSize: fontScale * 13}]}>
                {detail?.[0]?.address}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('MapScreen');
                }}>
                <Text
                  style={[
                    styles.heading,
                    {
                      color: COLORS.primary,
                      paddingTop: 5,
                    },
                  ]}>
                  Open on maps
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <MidTabs route={{ params: { detail } }}/>
        </View>
        {loader && <ScreenLoader isProcessing={loader} />}
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
    flexGrow: 1,
  },
  rate: {
    fontSize: fontScale * 14,
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
    borderColor: COLORS.cardsBorderColor,
    marginHorizontal: 12,
  },
  heading: {
    fontSize: fontScale * 16,
    fontFamily: FONTS.Inter600,
    lineHeight: 19,
    color: COLORS.base,
  },
  address: {
    fontSize: fontScale * 14,
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
    height: height * 0.04,
  },
  mapsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    paddingLeft: width * 0.05,
    paddingVertical: height * 0.02,
  },
  Btn: {
    backgroundColor: 'white',
    position: 'absolute',
    width: 50,
    height: 30,
    alignItems: 'center',
    borderRadius: 8,
    right: 15,
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
