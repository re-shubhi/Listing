import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
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
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import ScreenBackgroundHome from '../components/ScreenBackgroundHome';
import SwiperFlatList from 'react-native-swiper-flatlist';
import CategoryListData from './CategoryListData';
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

const {fontScale, width, height} = Dimensions.get('screen');

const HomeScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const isRTL = I18nManager.isRTL;
  const isfocus = useIsFocused();
  const [numColumns, setNumColumns] = useState(4);
  // const [search, setSearch] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [slider, setSLider] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSelectedItem] = useState(null);
  // console.log('🚀 ~ HomeScreen ~ selectedItem:', search);
  const [loader, setLoader] = useState(false);
  const [permissionAlertShown, setPermissionAlertShown] = useState(false);
  const {
    getLocation,
    requestPermissionLocation,
    locationPermission,
    productListing,
    location,
  } = useContext(AuthContext);
  // console.log("🚀 ~ HomeScreen ~ locationPermission:====", locationPermission)

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
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', backButtonHandler);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
      };
    }, []),
  );
  //clear search
  const onClearPress = useCallback(() => {
    setRefreshKey(prevKey => prevKey + 1);
    setSelectedItem('');
  }, []);
  //search
  const searchIcon = (
    <View style={{backgroundColor: 'red', padding: 10}}>
      <Image
        source={require('../assets/images/icons/search.png')}
        style={{height: 20, width: 20}}
        resizeMode="contain"
      />
    </View>
  );

  const locationPermissionHandler = () => {
    Alert.alert(
      'Location Permission',
      'Location Permission is required in the app.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Settings',
          onPress: () => {
            Linking.openSettings();
          },
        },
      ],
      {
        cancelable: false,
      },
    );
    setPermissionAlertShown(true);
    AsyncStorage.setItem('locationPermissionAlertShown', 'true');
  };

  //Banner Slider Api
  const Banner = async () => {
    try {
      setLoader(true);
      const response = await axios({
        method: 'POST',
        url: homescreen,
      });
      // console.log('Home response', response?.data);
      if (response?.data?.status === true) {
        setLoader(false);
        setSLider(response?.data?.slider);
        setCategoryList(response?.data?.category);
      }
    } catch (error) {
      // console.log('error', error?.response?.data?.message);
      setLoader(false);
    }
  };
  //refresh
  const onRefreshing = useCallback(() => {
    setSelectedItem('');
    setRefresh(true);
    Banner();
    setTimeout(() => {
      setRefresh(false);
      setRefreshKey(prevKey => prevKey + 1); // Increment key to force reset after refresh
    }, 500);
  }, []);

  //useeffect
  useEffect(() => {
    Banner();
    getLocation();
  }, [isfocus, navigation]);

  // useEffect(() => {
  //   // Check if alert has been shown before
  //   const checkAlertState = async () => {
  //     const alertShown = await AsyncStorage.getItem(
  //       'locationPermissionAlertShown',
  //     );
  //     if (Platform.OS === 'ios' && location === '' && alertShown !== 'true') {
  //       locationPermissionHandler();
  //     }
  //   };
  //   checkAlertState();
  // }, [location]);

  useEffect(() => {
    const listner = navigation.addListener('focus', () => {
      setRefreshKey(prevKey => prevKey + 1);
      setSelectedItem('');
    });
    return listner;
  }, [navigation]);

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
            onSelectItem={item => setSelectedItem(item?.title || '')}
            onChangeText={text => setSelectedItem(text)}
            dataSet={productListing}
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
          <View
            style={{
              paddingHorizontal: width * 0.03,
            }}>
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
            {categoryList.length > 6 && (
              <TouchableOpacity
                style={{alignSelf: 'flex-end'}}
                onPress={() =>
                  navigation.navigate('Categories', {data: categoryList})
                }>
                <Text style={styles.seemore}>See More</Text>
              </TouchableOpacity>
            )}
            <View style={[styles.container]}>
              <FlatList
                data={categoryList}
                key={`${numColumns}`}
                // keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                numColumns={numColumns}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      style={[styles.box, styles.boxWithShadow]}
                      onPress={() =>
                        navigation.navigate('ParticularCategory', {data: item})
                      }>
                      <Image
                        source={{uri: item.category_icon}}
                        style={{height: 24, width: 24}}
                        resizeMode="contain"
                      />
                      <Text numberOfLines={1} style={styles.CategoryText}>
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                ItemSeparatorComponent={() => {
                  return <View style={styles.seperator} />;
                }}
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

export default HomeScreen;

const styles = StyleSheet.create({
  search: {
    backgroundColor: COLORS.darkgray,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 5 : 0,
    borderRadius: 10,
    marginTop: height * 0.01,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.darkgray,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: fontScale * 16,
    fontFamily: FONTS.Inter400,
    color: COLORS.white,
  },
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
    marginTop: Platform.OS == 'ios' ? 0 : 8,
  },
  container: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.cardsBorderColor,
    alignItems: 'center',
  },
});
