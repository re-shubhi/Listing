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
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import CardData from '../heart/CardData';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../restapi/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addRemoveWishlist} from '../restapi/ApiConfig';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';

const {height, width, fontScale} = Dimensions.get('screen');

const RecentList = () => {
  const navigation = useNavigation();
  const [numColumns, setNumColumns] = useState(2);
  const [distance, setDistance] = useState({});
  const {productListing, ListWishlist, location} = useContext(AuthContext);
  // console.log('productListingproductListing', productListing);

  useEffect(() => {
    // Calculate distances for all items when location or productListing changes
    const distances = {};
    productListing.forEach(item => {
      const lat1 = location?.coords?.latitude;
      const lon1 = location?.coords?.longitude;
      const lat2 = item.latitude;
      const lon2 = item.longitude;
      distances[item.id] = calculateDistance(lat1, lon1, lat2, lon2);
    });
    setDistance(distances);
  }, [location, productListing]);

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
    console.log('ListWishlist====idddd', id);
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
      console.log('error add', error?.response);
    }
  };
  const renderItem = ({item}) => {
    const itemDistance = distance[item.id]?.toFixed(2) || '';
    return (
      <>
        <TouchableOpacity
          style={[styles.card, styles.boxWithShadow]}
          onPress={() => navigation.navigate('DetailScreen', {data: item})}>
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
                style={{height: 18, width: 18}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <Text numberOfLines={1} style={styles.address}>
            {item?.address.substring(0, 30)}
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
              <Text style={styles.rate}>{Math.ceil(itemDistance)} km</Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  };
  return (
    <>
      <FlatList
        data={productListing}
        key={`${numColumns}`} // Change key when numColumns changes
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 30}}
        renderItem={renderItem}
        ItemSeparatorComponent={() => {
          return <View style={styles.seperator} />;
        }}
      />
    </>
  );
};

export default RecentList;

const styles = StyleSheet.create({
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
  CardTitle: {
    fontSize: fontScale * 16,
    fontFamily: FONTS.Inter600,
    lineHeight: 21,
    color: COLORS.base,
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
});
