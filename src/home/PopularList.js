import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  I18nManager,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FONTS from '../theme/Fonts';
import COLORS from '../theme/Colors';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {AuthContext} from '../restapi/AuthContext';
import {addRemoveWishlist} from '../restapi/ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import useDebounce from '../restapi/useDebounce';
import GuestModal from '../components/GuestModal';
import {useTranslation} from 'react-i18next';
import {translateText} from '../../services/translationService';

const {height, width, fontScale} = Dimensions.get('screen');

const PopularList = ({search}) => {
  const navigation = useNavigation();
  const isFocus = useIsFocused();
  const {t} = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [distance, setDistance] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [translatedProductList, setTranslatedProductList] = useState([]);
  const {productListing, ListWishlist, location, wishlist} =
    useContext(AuthContext);
  const [likedItems, setLikedItems] = useState({});
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  console.log("🚀 ~ PopularList ~ productListing:", productListing)
  // Debounced search term
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const fetchTranslatedCategory = async () => {
      if (debouncedSearch) {
        try {
          const translation = await translateText(debouncedSearch, 'en');
          console.log("🚀 ~ fetchTranslatedCategory ~ translation:", translation)
          setDebouncedSearchTerm(translation);
        } catch (error) {
          console.log('Error fetching translation:', error);
        }
      } else {
        setDebouncedSearchTerm('');
      }
    };
    fetchTranslatedCategory();
  }, [debouncedSearch]);

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

    // Initialize liked state based on wishlist
    const initialLikedItems = {};
    wishlist.forEach(item => {
      initialLikedItems[item.product_id] = true;
    });
    setLikedItems(initialLikedItems);
  }, [location, productListing, wishlist]);

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

  // Api to add/remove wishList
  const AddRemove = async id => {
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
        // Toggle liked status for the item
        setLikedItems(prevState => ({
          ...prevState,
          [id]: !prevState[id],
        }));
        await ListWishlist();
      }
    } catch (error) {
      console.log('Error adding/removing wishlist item:', error?.response);
    }
  };

  const filterPopularItems = () => {
    return productListing.filter(
      item =>
        item.product_type === 'popular' &&
        item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    );
  };

  const fetchTranslatedPopularListings = async items => {
    const lang = (await AsyncStorage.getItem('languageSelected')) || 'en';
    if (items.length > 0) {
      const translatedListings = await Promise.all(
        items.map(async item => {
          const translatedTitle = await translateText(item.title, lang);
          const translatedAddress = await translateText(item.address, lang);
          return {
            ...item,
            title: translatedTitle,
            address: translatedAddress,
            rating: item.rating, // Rating does not need translation
          };
        }),
      );
      setTranslatedProductList(translatedListings);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const filteredPopularItems = filterPopularItems();
      if (filteredPopularItems.length > 0) {
        await fetchTranslatedPopularListings(filteredPopularItems);
      } else {
        setTranslatedProductList([]);
      }
    };
    fetchData();
  }, [debouncedSearchTerm, isFocus, productListing, location, wishlist]);

  const showGuestModal = () => {
    setShowModal(true);
  };
  const hideGuestModal = () => {
    setShowModal(false);
  };

  // Render item function for FlatList
  const renderItem = ({item}) => {
    const itemDistance = distance[item.id]?.toFixed(2) || '';
    const isLiked = likedItems[item?.id];
    return (
      <View style={[styles.box, styles.boxWithShadow]}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('DetailScreen', {data: item?.category_id})
          }>
          <Image
            source={{uri: item?.image}}
            style={{height: 90, width: 90, borderRadius: 10}}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <View style={{rowGap: 4}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingRight: 15,
            }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DetailScreen', {data: item?.category_id})
              }>
              <Text style={styles.CardTitle}>{item.title}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                isGuest ? showGuestModal() : AddRemove(item?.category_id)
              }>
              <Image
                source={
                  isLiked
                    ? require('../assets/images/icons/heart2.png')
                    : require('../assets/images/icons/heartBlank.png')
                }
                style={{height: 17, width: 17}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View style={{width: width * 0.5}}>
            <Text
              style={[
                styles.address,
                {alignSelf: isRTL ? 'flex-start' : 'flex-end'},
              ]}>
              {item?.address.substring(0, 30)}
            </Text>
          </View>
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
              <Text style={styles.rate}>
                {' '}
                {itemDistance > 0 ? Math.ceil(itemDistance) : 0} {t('km')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // For Guest Check
  useEffect(() => {
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
    <View>
      {translatedProductList.length > 0 && (
        <>
          <Text
            style={[styles.headingText, {alignSelf: isRTL ? 'right' : 'left'}]}>
            {t('popular')}
          </Text>
          <FlatList
            data={translatedProductList}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.seperator} />}
          />
        </>
      )}
      <GuestModal
        visible={showModal}
        onClose={hideGuestModal}
        navigation={navigation}
      />
    </View>
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
  seperator: {width: 15, backgroundColor: 'transparent'},
  headingText: {
    fontSize: fontScale * 16,
    color: COLORS.base,
    fontFamily: FONTS.Inter600,
    lineHeight: 21,
    paddingLeft: 5,
    marginTop: Platform.OS == 'ios' ? 20 : 8,
  },
});
