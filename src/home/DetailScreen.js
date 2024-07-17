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
  Modal,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
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
import {AuthContext} from '../restapi/AuthContext';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GuestModal from '../components/GuestModal';

const Tab = createMaterialTopTabNavigator();

const DetailScreen = props => {
  const navigation = useNavigation();
  const isfocus = useIsFocused();
  const [scrollY] = useState(new Animated.Value(0));
  const HEADER_MAX_HEIGHT = 290;
  const HEADER_MIN_HEIGHT = Platform.OS == 'ios' ? 100 : height * 0.07;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
  const [showModal, setShowModal] = useState(false);

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
  const [distance, setDistance] = useState(null);
  const {location, addressLocation} = useContext(AuthContext);
  const [isGuest, setIsGuest] = useState(false);
  const showGuestModal = () => {
    setShowModal(true);
  };
  // Function to hide the guest registration modal
  const hideGuestModal = () => {
    setShowModal(false);
  };

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
  console.log('00000', detail);
  console.log('locationlocation', location);
  console.log('locationloaddressLocationcation', addressLocation);
  const lat1 = location?.coords?.latitude;
  const lon1 = location?.coords?.longitude;
  const lat2 = parseFloat(detail?.[0]?.latitude);
  const lon2 = parseFloat(detail?.[0]?.longitude);

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    console.log('distance ====', distance);
    setDistance(distance);
    return;
    distance;
  }
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  useEffect(() => {
    ProductDetail();
  }, [isfocus]);
  useEffect(() => {
    if (location && detail && detail.length > 0) {
      const lat1 = location?.coords?.latitude;
      const lon1 = location?.coords?.longitude;
      const lat2 = parseFloat(detail?.[0]?.latitude);
      const lon2 = parseFloat(detail?.[0]?.longitude);
      calculateDistance(lat1, lon1, lat2, lon2);
    }
  }, [location, detail]);

  useEffect(() => {
    // Check user status from AsyncStorage
    const checkUserStatus = async () => {
      try {
        const userStatus = await AsyncStorage.getItem('userStatus');
        const token = await AsyncStorage.getItem('token');

        if (userStatus === 'registered' && token) {
          setIsGuest(false);
        } else {
          setIsGuest(true);
        }
      } catch (error) {
        console.error('Error fetching user status:', error);
        setIsGuest(true);
      }
    };

    checkUserStatus();
  }, []);

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
            onPress={() =>
              isGuest
                ? showGuestModal()
                : props.navigation.navigate('GridImageView', {
                    data: detail?.[0]?.galleryData,
                  })
            }>
            <Image
              resizeMode="contain"
              style={{height: 15, width: 15}}
              source={require('../assets/images/icons/imgIcon.png')}
            />
            <Text style={{color: '#000', fontWeight: '800'}}>
              {detail?.[0]?.galleryData.length}
            </Text>
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
          <View style={[styles.container]}>
            <View style={{rowGap: 4, width: width * 0.65}}>
              <Text style={styles.heading}>{detail?.[0]?.title}</Text>
              <Text style={styles.address}>{detail?.[0]?.address}</Text>
              <View style={{flexDirection: 'row', columnGap: 5, paddingTop: 5}}>
                <Image
                  source={require('../assets/images/icons/star2.png')}
                  style={{height: 16, width: 16}}
                  resizeMode="contain"
                />
                <Text style={styles.rate}>
                  {Math.ceil(detail?.[0]?.rating)}
                </Text>
                <TouchableOpacity
                  style={{marginLeft: 8}}
                  onPress={() =>
                    isGuest
                      ? showGuestModal()
                      : navigation.navigate('ReviewListing',{data: detail?.[0]})
                  }>
                  <Text style={styles.rate}>
                    ( {detail?.[0]?.review} reviews )
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.distanceCont, {width: width * 0.28}]}>
              <Text
                numberOfLines={1}
                style={[
                  styles.heading,
                  {color: COLORS.white, fontSize: fontScale * 15},
                ]}>
                {Math.ceil(distance)} km
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
                  isGuest
                    ? showGuestModal()
                    : navigation.navigate('MapScreen', {data: detail?.[0]});
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
          <MidTabs route={{params: {detail}}} />
        </View>
        {loader && <ScreenLoader isProcessing={loader} />}
      </ScrollView>
      <GuestModal
        visible={showModal}
        onClose={hideGuestModal}
        navigation={navigation}
      />
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.white,
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
    backgroundColor: COLORS.white,
    position: 'absolute',
    width: 50,
    height: 30,
    alignItems: 'center',
    borderRadius: 8,
    right: 15,
    bottom: Platform.OS === 'ios' ? 45 : 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
