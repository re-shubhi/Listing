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
import React, {useEffect, useState} from 'react';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {height, width, fontScale} = Dimensions.get('screen');

const ReviewComponent = ({data}) => {
  console.log('data?.id', data?.about_product);
  console.log('data', data);
  const isFocus = useIsFocused();
  const navigation = useNavigation();
  const {t} = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [reviewData, setReviewData] = useState([]);
  const [translatedWishlist, setTranslatedWishlist] = useState([]);

  useEffect(() => {
    if (data) {
      setReviewData(data[0]?.productReview || []);
    }
  }, [isFocus, data]);

  const fetchTranslatedWishlist = async () => {
    const lang = (await AsyncStorage.getItem('languageSelected')) || 'en';

    if (reviewData && reviewData.length > 0) {
      try {
        const translatedList = await Promise.all(
          reviewData.map(async item => {
            try {
              const translatedName = await translateText(
                item.customerName,
                lang,
              );
              const translatedReview = await translateText(item.review, lang);
              return {
                ...item,
                customerName: translatedName,
                review: translatedReview,
              };
            } catch (translationError) {
              // console.error('Translation failed for item:', item, translationError);
              return item; // Fallback to original item if translation fails
            }
          }),
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

  useEffect(() => {
    const fetchData = async () => {
      await fetchTranslatedWishlist();
    };
    fetchData();
  }, [isFocus, reviewData]);
  return (
    <View style={styles.RemainingScreen}>
      {translatedWishlist.length > 0 ? (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
              paddingBottom:10,
              borderBottomWidth:1,
              borderColor: COLORS.base,
            }}>
            <Text style={styles.heading}>Customer Reviews</Text>
            {translatedWishlist.length > 10 && (
              <TouchableOpacity
                onPress={() =>
                  navigation?.navigate('ReviewListing', {
                    data: data?.[0],
                  })
                }>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={(translatedWishlist.slice(0,10))}
            keyExtractor={item => item.id.toString()} // Ensure keyExtractor is consistent
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 60}}
            max
            renderItem={({item}) => (
              <View style={styles.container}>
                <Image
                  source={require('../assets/images/icons/review.png')}
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
                    <Text style={styles.ratingText}>{item?.rating}</Text>
                  </View>
                </View>
              </View>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{t('No reviews')}</Text>
              </View>
            )}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('No reviews')}</Text>
        </View>
      )}
    </View>
  );
};

export default ReviewComponent;

const styles = StyleSheet.create({
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
    alignSelf: 'center',
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
  heading: {
    fontSize: fontScale * 16,
    color: COLORS.base,
    fontFamily: FONTS.Inter600,
    lineHeight: 21,
    paddingLeft: 5,
    marginTop: Platform.OS === 'ios' ? 0 : 8,
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: fontScale * 15,
    fontFamily: FONTS.Inter500,
    lineHeight: 21,
  },
});
