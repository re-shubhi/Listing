import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenWithBackground from '../components/ScreenWithBackground';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import CardData from './CardData';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {addRemoveWishlist, getWishList} from '../restapi/ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../restapi/AuthContext';
import {showMessage} from 'react-native-flash-message';

const {height, width, fontScale} = Dimensions.get('screen');

const Wishlist = () => {
  const navigation = useNavigation();
  const [distance, setDistance] = useState({});
  const [numColumns, setNumColumns] = useState(2); // State for the number of columns
  const {ListWishlist, wishlist, location} = useContext(AuthContext);

  useEffect(() => {
    // Calculate distances for all items when location or productListing changes
    const distances = {};
    wishlist.forEach(item => {
      const lat1 = location?.coords?.latitude;
      const lon1 = location?.coords?.longitude;
      const lat2 = item.latitude;
      const lon2 = item.longitude;
      distances[item.id] = calculateDistance(lat1, lon1, lat2, lon2);
    });
    setDistance(distances);
  }, [location, wishlist]);

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

    return distance;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  //Api to add remove wishList
  const AddRemove = async id => {
    console.log('ListWishlist----idd', id);
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios({
        method: 'POST',
        url: addRemoveWishlist,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          product_id: id,
        },
      });
      console.log('resss addd/remove---', response?.data);
      if (response?.data?.status === true) {
        showMessage({
          message: response?.data?.message,
          type: 'success',
        });
        await ListWishlist();
      }
    } catch (error) {
      console.log('error add', error?.response?.data);
    }
  };

  const renderItem = ({item}) => {
    const itemDistance = distance[item.id]?.toFixed(2) || '';
    return (
      <>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('DetailScreen', {data: item?.category_id})
          }
          style={[styles.card, styles.boxWithShadow]}>
          <Image
            source={{uri: item?.image}}
            style={styles.banner}
            resizeMode="cover"
          />
          <View style={styles.content}>
            <Text numberOfLines={1} style={styles.CardTitle}>
              {item.title}
            </Text>
            <TouchableOpacity onPress={() => AddRemove(item?.category_id)}>
              <Image
                source={
                  item.liked
                    ? require('../assets/images/icons/redheart.png')
                    : require('../assets/images/icons/heart.png')
                }
                style={{height: 15, width: 15}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <Text numberOfLines={1} style={styles.address}>
            {item.address}
          </Text>
          <View style={styles.lastcontainer}>
            <View style={{flexDirection: 'row', columnGap: 5}}>
              <Image
                source={require('../assets/images/icons/star2.png')}
                style={{height: 18, width: 18}}
                resizeMode="contain"
              />
              <Text style={styles.rate}>{Math.ceil(item.rating)}</Text>
            </View>
            <View style={{flexDirection: 'row', columnGap: 5}}>
              <Image
                source={require('../assets/images/icons/location.png')}
                style={{height: 18, width: 18}}
                resizeMode="contain"
              />
              <Text style={styles.rate}>{Math.ceil(itemDistance)} km </Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  useEffect(() => {
    ListWishlist();
  }, [navigation]);

  return (
    <ScreenWithBackground>
      <SafeAreaView style={styles.container}>
        <Header
          backicon={true}
          backgroundColor={COLORS.base}
          tintColor={COLORS.white}
          headerText={'Wishlist'}
        />
        <View style={styles.fullScreenRed}>
          <FlatList
            data={wishlist}
            key={`${numColumns}`} // Change key when numColumns changes
            numColumns={numColumns}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 30}}
            renderItem={renderItem}
            ItemSeparatorComponent={() => {
              return <View style={styles.seperator} />;
            }}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    justifyContent: 'center',
                    height: height * 0.7,
                    backgroundColor: COLORS.white,
                    alignItems: 'center',
                  }}>
                  <Text>No Data Found</Text>
                </View>
              );
            }}
          />
        </View>
      </SafeAreaView>
    </ScreenWithBackground>
  );
};

export default Wishlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreenRed: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: height * 0.02,
    marginHorizontal: width * 0.02,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    paddingVertical: Platform.OS === 'ios' ? height * 0.01 : height * 0.005,
  },
  CardTitle: {
    fontSize: fontScale * 16,
    fontFamily: FONTS.Inter600,
    lineHeight: 21,
    color: COLORS.black,
  },
  address: {
    fontSize: fontScale * 14,
    lineHeight: 19,
    fontFamily: FONTS.Inter400,
    color: COLORS.base,
    paddingHorizontal: 5,
  },
  rate: {
    fontSize: fontScale * 13,
    lineHeight: 19,
    fontFamily: FONTS.Inter400,
    color: COLORS.base,
  },
  card: {
    backgroundColor: COLORS.white,
    maxWidth: width * 0.44,
    padding: Platform.OS === 'ios' ? 10 : 5,
    maxHeight: height * 0.3,
    marginHorizontal: 2,
    borderRadius: 10,
    marginTop: Platform.OS === 'ios' ? 5 : 8,
  },
  banner: {
    height: height * 0.1,
    width: width * 0.42,
    alignSelf: 'center',
    borderRadius: 10,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  lastcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: width * 0.05,
    paddingVertical: 5,
    paddingLeft: 5,
    alignItems: 'center',
  },
  seperator: {
    height: Platform.OS === 'ios' ? 10 : 0,
    backgroundColor: 'transparent',
  },
  boxWithShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 2,
  },
});
