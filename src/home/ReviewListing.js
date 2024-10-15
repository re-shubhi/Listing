import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Platform,
  I18nManager,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import ScreenWithBackground from '../components/ScreenWithBackground';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {AuthContext} from '../restapi/AuthContext';
import ScreenLoader from '../components/ScreenLoader';
import {useTranslation} from 'react-i18next';
import {translateText} from '../../services/translationService'; 

const {height, width, fontScale} = Dimensions.get('screen');

const ReviewListing = props => {
  const navigation = useNavigation();
  const isFocus = useIsFocused();
  const {t} = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [loader, setLoader] = useState(false);
  const [reviewData, setReviewData] = useState([]);
  const [translatedWishlist, setTranslatedWishlist] = useState([]);
  const {data} = props?.route?.params;


  //function to convert numbers
  const convertToArabicNumbers = (text) => {
    const arabicDigits = '٠١٢٣٤٥٦٧٨٩'; // Arabic numerals 0-9
    const englishDigits = '0123456789'; // Western numerals 0-9
  
    return text.replace(/\d/g, (digit) => arabicDigits[englishDigits.indexOf(digit)]);
  };
  

  useEffect(() => {
    setReviewData(data?.productReview || []);
  }, [isFocus, data]);

  const fetchTranslatedWishlist = async () => {
    const lang = (await AsyncStorage.getItem('languageSelected')) || 'en';
    
    if (reviewData && reviewData.length > 0) {
      try {
        const translatedList = await Promise.all(
          reviewData.map(async item => {
            try {
              const translatedName = await translateText(item.customerName, lang);
              const translatedReview = await translateText(item.review, lang);
              return {
                ...item,
                customerName: translatedName,
                review:translatedReview,
              };
            } catch (translationError) {
              // console.error('Translation failed for item:', item, translationError);
              return item; // Fallback to original item if translation fails
            }
          })
        );
        setTranslatedWishlist(translatedList);
      } catch (error) {
        // console.error('Error fetching translated wishlist:', error);
        setTranslatedWishlist([]); 
      }
    } else {
      setTranslatedWishlist([]);
    }
  };
  

  useEffect(()=>{
    const fetchData = async () =>{
      await fetchTranslatedWishlist()
    }
    fetchData()
  },[isFocus,reviewData])

  return (
    <ScreenWithBackground>
      <SafeAreaView style={styles.screen}>
        <Header
          backicon={true}
          headerText={t('Reviews')}
          backgroundColor={COLORS.base}
          tintColor={COLORS.white}
        />
        <View style={styles.RemainingScreen}>
          {translatedWishlist.length > 0 ? (
            <FlatList
              data={translatedWishlist}
              keyExtractor={item => item.id.toString()} // Ensure keyExtractor is consistent
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 60}}
              renderItem={({item}) => (
                <View style={styles.container}>
                  <Image
                    source={require('../assets/images/icons/review.png')
                    }
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <View style={styles.textContainer}>
                    <Text style={[styles.nameText, {alignSelf: 'flex-start'}]}>
                      {item.customerName}
                    </Text>
                    <Text
                      style={[
                        styles.nameText,
                        {
                          fontFamily: FONTS.Inter400,
                          paddingTop: 2,
                          fontSize: fontScale * 14,
                          alignSelf: 'flex-start',
                        },
                      ]}>
                      {item.review}
                    </Text>
                    <View style={styles.ratingContainer}>
                      <Image
                        source={require('../assets/images/icons/star2.png')}
                        style={styles.starImage}
                        resizeMode="contain"
                      />
                      <Text style={styles.ratingText}>
                        {item?.rating}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {t('No reviews')}
                  </Text>
                </View>
              )}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {t('No reviews')}
              </Text>
            </View>
          )}
        </View>
        {loader && <ScreenLoader isProcessing={loader} />}
      </SafeAreaView>
    </ScreenWithBackground>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  RemainingScreen: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.01,
    marginTop: height * 0.02,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginHorizontal: width * 0.02,
  },
  nameText: {
    fontSize: fontScale * 15,
    fontFamily: FONTS.Inter500,
    color: COLORS.black,
    lineHeight: 18,
  },
  image: {
    height: 40,
    width: 40,
    alignSelf:'center'
  },
  textContainer: {
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    columnGap: 5,
    paddingTop: 5,
  },
  starImage: {
    height: 16,
    width: 16,
  },
  ratingText: {
    fontSize: fontScale * 12,
    fontFamily: FONTS.Inter400,
    lineHeight: 17,
  },
  emptyContainer: {
    justifyContent: 'center',
    height: height * 0.7,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontScale * 16,
    color: COLORS.black,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 10,
    paddingVertical: height * 0.01,
    borderBottomWidth: 0.5,
    borderColor: COLORS.base,
  },
});

export default ReviewListing;
