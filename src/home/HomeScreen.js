import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Platform,
  StatusBar,
  BackHandler,
  Alert,
  RefreshControl,
  Linking,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import ScreenBackgroundHome from '../components/ScreenBackgroundHome';
import SwiperFlatList from 'react-native-swiper-flatlist';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import PopularList from './PopularList';
import RecentList from './RecentList';
import axios from 'axios';
import {homescreen} from '../restapi/ApiConfig';
import ScreenLoader from '../components/ScreenLoader';
import {AuthContext} from '../restapi/AuthContext';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import {I18nManager} from 'react-native';
import {translateText} from '../../services/translationService';

const {fontScale, width, height} = Dimensions.get('screen');

const HomeScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const isRTL = I18nManager.isRTL;
  const isFocus = useIsFocused();
  const [numColumns, setNumColumns] = useState(4);
  const [categoryList, setCategoryList] = useState([]);
  const [slider, setSlider] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSelectedItem] = useState('');
  const [loader, setLoader] = useState(false);
  const [translatedProductList, setTranslatedProductList] = useState([]);
  const {getLocation, productListing} = useContext(AuthContext);

  // Handle back button press
  const backButtonHandler = () => {
    Alert.alert(
      'Exit App',
      'Are you sure you want to exit the app?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Exit',
          onPress: () => BackHandler.exitApp(),
        },
      ],
      {
        cancelable: false,
      },
    );
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', backButtonHandler);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
      };
    }, []),
  );

  const fetchTranslatedProductListings = async () => {
    const lang = (await AsyncStorage.getItem('languageSelected')) || 'en';
    if (productListing && productListing.length > 0) {
      const translatedListings = await Promise.all(
        productListing.map(async item => {
          const translatedTitle = await translateText(item.title, lang);
          return {
            ...item,
            title: translatedTitle,
          };
        }),
      );
      setTranslatedProductList(translatedListings);
    }
  };

  // Clear search
  const onClearPress = useCallback(() => {
    setRefreshKey(prevKey => prevKey + 1);
    setSelectedItem('');
  }, []);

  // Search icon
  const searchIcon = (
    <View style={{backgroundColor: 'red', padding: 10}}>
      <Image
        source={require('../assets/images/icons/search.png')}
        style={{height: 20, width: 20}}
        resizeMode="contain"
      />
    </View>
  );

  // Banner Slider API call
  const Banner = async () => {
    const lang = (await AsyncStorage.getItem('languageSelected')) || 'en';
    try {
      setLoader(true);
      const response = await axios.post(homescreen);
      if (response?.data?.status === true) {
        setLoader(false);
        setSlider(response.data.slider);
        const translatedCategories = await Promise.all(
          response.data.category.map(async item => {
            const translatedTitle = await translateText(item.title, lang);
            return {
              ...item,
              title: translatedTitle,
            };
          }),
        );
        setCategoryList(translatedCategories);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  // Refresh handler
  const onRefreshing = useCallback(() => {
    setSelectedItem('');
    setRefresh(true);
    fetchTranslatedProductListings();
    Banner();
    setTimeout(() => {
      setRefresh(false);
      setRefreshKey(prevKey => prevKey + 1);
    }, 500);
  }, []);

  // Effect to handle component mounting and focus
  useEffect(() => {
    Banner();
    getLocation();
    fetchTranslatedProductListings();
  }, [isFocus, navigation]);

  useEffect(() => {
    const listener = navigation.addListener('focus', () => {
      setRefreshKey(prevKey => prevKey + 1);
      fetchTranslatedProductListings();
      setSelectedItem('');
    });
    return listener;
  }, [navigation, isFocus]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchTranslatedProductListings();
    };
    fetchData();
  }, [isFocus, navigation, productListing]);

  return (
    <ScreenBackgroundHome>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor={COLORS.base} barStyle={'dark-content'} />
        <Header backgroundColor={COLORS.base} headerText={t('home')} />

        <View
          style={{
            paddingHorizontal: width * 0.03,
            paddingBottom: height * 0.02,
          }}>
          <AutocompleteDropdown
            clearOnFocus={false}
            closeOnBlur={true}
            key={refreshKey}
            closeOnSubmit={false}
            onSelectItem={item => {
              setSelectedItem(item?.title || '');
            }}
            onChangeText={text => setSelectedItem(text)}
            dataSet={translatedProductList}
            onClear={onClearPress}
            inputHeight={50}
            showChevron={false}
            debounce={500}
            suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
            inputContainerStyle={{
              paddingHorizontal: 15,
              paddingVertical: Platform.OS === 'ios' ? 5 : 0,
              borderRadius: 10,
              marginTop: height * 0.01,
              backgroundColor: COLORS.darkgray,
              flexDirection: 'row',
              alignItems: 'center',
              leftIcon: searchIcon,
            }}
            textInputProps={{
              placeholder: t('search_here'),
              placeholderTextColor: COLORS.white,
              autoCorrect: false,
              autoCapitalize: 'none',
              style: {
                backgroundColor: COLORS.darkgray,
                fontSize: fontScale * 16,
                fontFamily: FONTS.Inter400,
                color: COLORS.white,
                flex: 1,
                textAlign: isRTL ? 'right' : 'left',
              },
            }}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={onRefreshing}
              colors={[COLORS.primary]}
              tintColor={'#00BED4'}
            />
          }
          contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}>
          <View style={{paddingHorizontal: width * 0.03}}>
            <SwiperFlatList
              autoplay
              autoplayDelay={2}
              autoplayLoop
              index={2}
              showPagination
              data={slider}
              renderItem={({item}) => (
                <View style={styles.slide}>
                  <Image
                    source={{uri: item?.image}}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
              )}
              paginationStyle={{marginTop: 100}}
              paginationStyleItem={{height: 8, width: 30, marginHorizontal: 5}}
              paginationStyleItemActive={{backgroundColor: COLORS.primary}}
              paginationStyleItemInactive={{
                backgroundColor: COLORS.borderColor,
              }}
            />
          </View>

          <View style={styles.secondHalf}>
            {categoryList.length > 8 && (
              <TouchableOpacity
                style={{alignSelf: 'flex-end'}}
                onPress={() =>
                  navigation.navigate('Categories', {data: categoryList})
                }>
                <Text style={styles.seemore}>{t('See More')}</Text>
              </TouchableOpacity>
            )}
            <View style={styles.container}>
              <FlatList
                data={categoryList}
                key={`${numColumns}`}
                showsVerticalScrollIndicator={false}
                numColumns={numColumns}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={[styles.box, styles.boxWithShadow]}
                    onPress={() =>
                      navigation.navigate('ParticularCategory', {data: item})
                    }>
                    <Image
                      source={{uri: item.category_icon}}
                      style={{height: 24, width: 24, tintColor: COLORS.primary}}
                      resizeMode="contain"
                    />
                    <Text numberOfLines={1} style={styles.CategoryText}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.seperator} />}
              />
            </View>

            <View>
              <PopularList search={search} />
              <Text
                style={[
                  styles.headingText,
                  {
                    marginTop: Platform.OS === 'ios' ? 10 : 0,
                    alignSelf: isRTL ? 'right' : 'left',
                  },
                ]}>
                {t('recent')}
              </Text>
            </View>

            <View style={{alignItems: 'center'}}>
              <RecentList search={search} />
            </View>
          </View>
          {loader && <ScreenLoader isProcessing={loader} />}
        </ScrollView>
      </SafeAreaView>
    </ScreenBackgroundHome>
  );
};

const styles = StyleSheet.create({
  slide: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
    paddingRight: width * 0.06,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.04,
  },
  image: {
    height: height * 0.16,
    width: width * 0.9,
    borderRadius: 10,
  },
  seemore: {
    color: COLORS.primary,
    fontSize: fontScale * 12,
    fontFamily: FONTS.Inter500,
    lineHeight: 15,
  },
  secondHalf: {
    backgroundColor: COLORS.white,
    marginHorizontal: width * 0.02,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    padding: 10,
  },
  CategoryText: {
    fontSize: fontScale * 12,
    fontFamily: FONTS.Inter400,
    lineHeight: 19,
    color: COLORS.base,
    textAlign: 'center',
  },
  box: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardsBorderColor,
    backgroundColor: COLORS.white,
    padding: 5,
    borderRadius: 10,
    height: height * 0.07,
    width: width * 0.21,
    marginRight: 5,
    marginVertical: 8,
  },
  seperator: {height: 0, backgroundColor: 'transparent'},
  boxWithShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 1,
  },
  headingText: {
    fontSize: fontScale * 16,
    color: COLORS.base,
    fontFamily: FONTS.Inter600,
    lineHeight: 21,
    paddingLeft: 5,
    marginTop: Platform.OS === 'ios' ? 0 : 8,
  },
  container: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.cardsBorderColor,
    alignItems: 'center',
  },
});

export default HomeScreen;
