import React, { useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FONTS from '../theme/Fonts';
import COLORS from '../theme/Colors';
import CardData from '../heart/CardData';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../restapi/AuthContext';
import { addRemoveWishlist } from '../restapi/ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import axios from 'axios';

const { height, width, fontScale } = Dimensions.get('screen');

const PopularList = () => {
  const navigation = useNavigation();
  const [distance, setDistance] = useState({}); 
  const { productListing, ListWishlist, location } = useContext(AuthContext);

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

  // Function to calculate distance
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

  // Api to add remove wishList
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

  // Popular Listing
  const popularItems = productListing.filter(item => item.product_type === 'popular');

  // Render item function for FlatList
  const renderItem = ({ item }) => {
    const itemDistance = distance[item.id]?.toFixed(2) || '';
    
    return (
      <TouchableOpacity
        style={[styles.box, styles.boxWithShadow]}
        onPress={() =>
          navigation.navigate('DetailScreen', { data: item?.category_id })
        }
      >
        <Image
          source={{ uri: item?.image }}
          style={{ height: 90, width: 90, borderRadius: 10 }}
          resizeMode="cover"
        />
        <View style={{ rowGap: 4 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingRight: 15,
            }}
          >
            <Text style={styles.CardTitle}>{item.title}</Text>
            <TouchableOpacity onPress={() => AddRemove(item?.category_id)}>
              <Image
                source={
                  item.liked
                    ? require('../assets/images/icons/redheart.png')
                    : require('../assets/images/icons/heart.png')
                }
                style={{ height: 15, width: 15 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View style={{ width: width * 0.5 }}>
            <Text style={styles.address}>{item?.address.substring(0, 30)}</Text>
          </View>
          <View style={styles.lastcontainer}>
            <View style={{ flexDirection: 'row', columnGap: 5 }}>
              <Image
                source={require('../assets/images/icons/star2.png')}
                style={{ height: 18, width: 18 }}
                resizeMode="contain"
              />
              <Text style={styles.rate}>{Math.ceil(item.rating)}</Text>
            </View>
            <View style={{ flexDirection: 'row', columnGap: 5 }}>
              <Image
                source={require('../assets/images/icons/location.png')}
                style={{ height: 18, width: 18 }}
                resizeMode="contain"
              />
              <Text style={styles.rate}>{Math.ceil(itemDistance)} km</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={popularItems}
      keyExtractor={item => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={styles.seperator} />}
    />
  );
};

export default PopularList;

const styles = StyleSheet.create({
  lastcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: width * 0.05,
    paddingVertical: 5,
  },
  CardTitle: {
    fontSize: fontScale * 17,
    fontFamily: FONTS.Inter600,
    lineHeight: 21,
    color: COLORS.base,
  },
  address: {
    fontSize: fontScale * 13,
    lineHeight: 19,
    fontFamily: FONTS.Inter400,
    color: COLORS.base,
  },
  box: {
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
    padding: 4,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.cardsBorderColor,
    marginVertical: height * 0.01,
  },
  boxWithShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  seperator: { width: 15, backgroundColor: 'transparent' },
});
