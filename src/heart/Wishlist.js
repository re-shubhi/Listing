import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  I18nManager,
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
import {useIsFocused, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {addRemoveWishlist, getWishList} from '../restapi/ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../restapi/AuthContext';
import {showMessage} from 'react-native-flash-message';
import {useTranslation} from 'react-i18next';
import {translateText} from '../../services/translationService';

const {height, width, fontScale} = Dimensions.get('screen');

const Wishlist = () => {
  const navigation = useNavigation();
  const isFocus = useIsFocused();
  const isRTL = I18nManager.isRTL;
  const {t} = useTranslation();
  const [distance, setDistance] = useState({});
  const [likedItems, setLikedItems] = useState({});
  const [translatedwishlist, setTransaltedwishlist] = useState([]);
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
  }, [location]);

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
    // console.log('ListWishlist----idd', id);
    const token = await AsyncStorage.getItem('token');
    const lang = (await AsyncStorage.getItem('languageSelected')) || 'en';
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
      // console.log('resss addd/remove---', response?.data);
      if (response?.data?.status === true) {
        const translatedMessage = await translateText(
          response?.data?.message,
          lang,
        );
        showMessage({
          message: translatedMessage,
          type: 'success',
          style: {alignItems: 'flex-start'},
        });
        await ListWishlist();
      }
    } catch (error) {
      // console.log('error add', error?.response?.data);
    }
  };


  const renderItem = ({item}) => {
    const itemDistance = distance[item.id]?.toFixed(2) || '';
    return (
      <View style={[styles.card, styles.boxWithShadow]}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('DetailScreen', {data: item?.category_id})
          }>
          <Image
            source={{uri: item?.image}}
            style={styles.banner}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <View style={styles.content}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('DetailScreen', {data: item?.category_id})
            }>
            <Text numberOfLines={1} style={styles.CardTitle}>
              {item.title}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => AddRemove(item?.product_id)}>
            <Image
              source={require('../assets/images/icons/heart2.png')}
              style={{height: 17, width: 17}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <Text
          numberOfLines={1}
          style={[
            styles.address,
            {alignSelf: isRTL ? 'flex-start' : 'flex-end'},
          ]}>
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
            <Text style={styles.rate}>{Math.ceil(itemDistance)} {t('km')} </Text>
          </View>
        </View>
      </View>
    );
  };
  
    //function to convert numbers
    const convertToArabicNumbers = text => {
      const arabicDigits = '٠١٢٣٤٥٦٧٨٩'; // Arabic numerals 0-9
      const englishDigits = '0123456789'; // Western numerals 0-9
  
      return text.replace(
        /\d/g,
        digit => arabicDigits[englishDigits.indexOf(digit)],
      );
    };

  const fetchTranslatedWishList = async () => {
    const lang = (await AsyncStorage.getItem('languageSelected')) || 'en';
    {
      wishlist && wishlist.length > 0;
      const translatedList = await Promise.all(
        wishlist.map(async item => {
          const translatedTitle = await translateText(item.title, lang);
          const translatedAddress = await translateText(item.address, lang);
          const translatedRating = await translateText(item.rating, lang);
          return {
            ...item,
            title: translatedTitle,
            address: translatedAddress,
            rating:translatedRating
          };
        }),
      );
      setTransaltedwishlist(translatedList);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchTranslatedWishList();
    };
    fetchData();
  }, [isFocus, wishlist]);

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
          headerText={t('wishlist')}
        />
        <View style={styles.fullScreenRed}>
          <FlatList
            data={translatedwishlist}
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
                  <Text>{t('No data found')}</Text>
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
