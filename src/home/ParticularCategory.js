import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenWithBackground from '../components/ScreenWithBackground';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import CardData from '../heart/CardData';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {AuthContext} from '../restapi/AuthContext';
import {addRemoveWishlist} from '../restapi/ApiConfig';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
import GuestModal from '../components/GuestModal';
import {useTranslation} from 'react-i18next';
import {translateText} from '../../services/translationService';

const {height, width, fontScale} = Dimensions.get('screen');

const ParticularCategory = props => {
  const navigation = useNavigation();
  const isFocus = useIsFocused();
  const {t} = useTranslation();
  const [numColumns, setNumColumns] = useState(2);
  const [isGuest, setIsGuest] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [distance, setDistance] = useState({});
  const [likeItems, setLikedItems] = useState({});
  const {data} = props?.route?.params;
  // console.log('CATEGORY name---', data?.title);
  const [translatedCategoryName, setTranslatedCategoryName] = useState('');
  const [translatedwishlist, setTransaltedwishlist] = useState([]);

  const {productListing, ListWishlist, location, wishlist} =
    useContext(AuthContext);
  // console.log('PARTICULAR--productListing', productListing);

  useEffect(() => {
    const translatedCategory = async () => {
      if (data?.title) {
        try {
          const translation = await translateText(data?.title, 'en');
          console.log('🚀 ~ translatedCategory ~ translation:', translation);
          setTranslatedCategoryName(translation);
        } catch (error) {
          console.log('🚀 ~ useEffect ~ error:', error);
        }
      }
    };
    translatedCategory();
  }, [data?.title]);

  const Listing = productListing?.filter(
    item => item.category.toLowerCase() == translatedCategoryName.toLowerCase(),
  );
  // console.log('LISTINGG', Listing);

  const fetchTranslatedWishList = async () => {
    const lang = (await AsyncStorage.getItem('languageSelected')) || 'en';
    {
      Listing && Listing.length > 0;
      const translatedList = await Promise.all(
        Listing.map(async item => {
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
  }, [isFocus, Listing]);

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

    const initialLikedItems = {};
    wishlist.forEach(item => {
      initialLikedItems[item.product_id] = true;
    });
    setLikedItems(initialLikedItems);
  }, [location, productListing, wishlist]);

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
    // console.log('ListWishlist====idddd', id);
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
        setLikedItems(prevState => ({
          ...prevState,
          [id]: !prevState[id],
        }));
        await ListWishlist();
      }
    } catch (error) {
      // console.log('error add', error?.response);
    }
  };

  const renderItem = ({item}) => {
    const itemDistance = distance[item.id]?.toFixed(2) || '';
    const isLiked = likeItems[item?.id];
    return (
      <>
        <View style={[styles.card, styles.boxWithShadow]}>
          <TouchableOpacity
            onPress={() => navigation.navigate('DetailScreen', {data: item})}>
            <Image
              source={{uri: item?.image}}
              style={styles.banner}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <View style={styles.content}>
            <TouchableOpacity
              onPress={() => navigation.navigate('DetailScreen', {data: item})}>
              <Text numberOfLines={1} style={styles.CardTitle}>
                {item.title}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                isGuest ? showGuestModal() : AddRemove(item?.id)
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
              <Text style={styles.rate}>
                {Math.ceil(itemDistance)} {t('km')}
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  const showGuestModal = () => {
    setShowModal(true);
  };
  // Function to hide the guest registration modal
  const hideGuestModal = () => {
    setShowModal(false);
  };

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
        <StatusBar backgroundColor={COLORS.base} barStyle={'dark-content'} />
        <Header
          backicon={true}
          backgroundColor={COLORS.base}
          tintColor={COLORS.white}
          headerText={data?.title}
        />

        <View style={styles.fullScreenRed}>
          <FlatList
            data={translatedwishlist}
            key={`${numColumns}`} // Change key when numColumns changes
            numColumns={numColumns}
            showsVerticalScrollIndicator={false}
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
                  <Text>{t("No data found")}</Text>
                </View>
              );
            }}
          />
          <GuestModal
            visible={showModal}
            onClose={hideGuestModal}
            navigation={navigation}
          />
        </View>
      </SafeAreaView>
    </ScreenWithBackground>
  );
};

export default ParticularCategory;

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
