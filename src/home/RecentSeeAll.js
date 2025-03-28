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
import GuestModal from '../components/GuestModal';

const {height, width, fontScale} = Dimensions.get('screen');

const RecentSeeAll = () => {
  const navigation = useNavigation();
  const isFocus = useIsFocused();
  const {t} = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [distance, setDistance] = useState({});
  const [translatedProductList, setTranslatedProductList] = useState([]);
  const {productListing, ListWishlist, location, wishlist} =
    useContext(AuthContext);
  const [likedItems, setLikedItems] = useState({});
  const [numColumns, setNumColumns] = useState(2);
  const [showModal, setShowModal] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

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

//   const filterPopularItems = () => {
//     return productListing.filter(item => item.product_type !== 'popular');
//   };

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
      const filteredPopularItems = productListing;
      if (filteredPopularItems.length > 0) {
        await fetchTranslatedPopularListings(filteredPopularItems);
      } else {
        setTranslatedProductList([]);
      }
    };
    fetchData();
  }, [isFocus, productListing, location, wishlist]);

  const showGuestModal = () => {
    setShowModal(true);
  };
  const hideGuestModal = () => {
    setShowModal(false);
  };

  const renderItem = ({item}) => {
    const itemDistance = distance[item.id]?.toFixed(2) || '';
    const isLiked = likedItems[item?.id];
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('DetailScreen', {data: item?.category_id})
        }
        style={[styles.card, styles.boxWithShadow]}>
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
        <Text
          numberOfLines={1}
          style={[
            styles.address,
            // {alignSelf: isRTL ? 'flex-start' : 'flex-end'},
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
            <Text style={styles.rate}>
            {itemDistance > 0 ? Math.ceil(itemDistance) : "--"} {t('km')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
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
    <ScreenWithBackground>
      <SafeAreaView style={styles.container}>
        <Header
          backicon={true}
          backgroundColor={COLORS.base}
          tintColor={COLORS.white}
          headerText={t('popular')}
        />
        <View style={styles.fullScreenRed}>
          <FlatList
            data={translatedProductList}
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
                  {/* <Text>{t('No data found')}</Text> */}
                </View>
              );
            }}
          />
        </View>
      </SafeAreaView>
      <GuestModal
        visible={showModal}
        onClose={hideGuestModal}
        navigation={navigation}
      />
    </ScreenWithBackground>
  );
};

export default RecentSeeAll;

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
  seeAll: {
    color: COLORS.primary,
    fontSize: fontScale * 15,
    fontFamily: FONTS.Inter500,
    lineHeight: 21,
  },
});
