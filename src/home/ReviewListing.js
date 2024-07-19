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
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import ScreenWithBackground from '../components/ScreenWithBackground';
import axios from 'axios';
import {getNotification} from '../restapi/ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../restapi/AuthContext';
import moment from 'moment';
import ScreenLoader from '../components/ScreenLoader';

const {height, width, fontScale} = Dimensions.get('screen');

const ReviewListing = props => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [reviewData, setReviewData] = useState([]);
  const {data} = props?.route?.params;
  // console.log('data-->>>', data?.productReview);

  useEffect(() => {
    setReviewData(data?.productReview);
  }, []);

  return (
    <ScreenWithBackground>
      <SafeAreaView style={styles.screen}>
        <Header
          backicon={true}
          headerText={'Reviews'}
          backgroundColor={COLORS.base}
          tintColor={COLORS.white}
        />
        <View style={styles.RemainingScreen}>
          <FlatList
            data={reviewData}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 60}}
            // inverted
            renderItem={({item}) => {
              return (
                <>
                  <View style={styles.container}>
                    <Image
                      source={
                        data?.image
                          ? {uri: data?.image}
                          : require('../assets/images/pictures/profile3.png')
                      }
                      style={{
                        height: 50,
                        width: 50,
                        borderRadius: 10,
                        marginTop: Platform.OS === 'ios' ? 5 : 10,
                      }}
                      resizeMode="cover"
                    />
                    <View style={{flex: 1}}>
                      <Text style={styles.nameText}>{item.customerName}</Text>
                      <Text
                        style={{
                          ...styles.nameText,
                          fontFamily: FONTS.Inter400,
                          paddingTop: 2,
                          fontSize: fontScale * 14,
                        }}>
                        {item.review}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          columnGap: 5,
                          paddingTop: 5,
                        }}>
                        <Image
                          source={require('../assets/images/icons/star2.png')}
                          style={{height: 16, width: 16}}
                          resizeMode="contain"
                        />
                        <Text
                          style={{
                            ...styles.nameText,
                            fontSize: fontScale * 12,
                            fontFamily: FONTS.Inter400,
                            lineHeight: 17,
                          }}>
                          {item?.rating}
                        </Text>
                      </View>
                    </View>
                  </View>
                </>
              );
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
                  <Text style={{fontSize: fontScale * 16, color: COLORS.black}}>
                    No reviews
                  </Text>
                </View>
              );
            }}
          />
        </View>
        {loader && <ScreenLoader isProcessing={loader} />}
      </SafeAreaView>
    </ScreenWithBackground>
  );
};

export default ReviewListing;

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
  content: {
    fontSize: fontScale * 14,
    color: COLORS.base,
    fontFamily: FONTS.Inter400,
    lineHeight: 18,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 10,
    paddingVertical: height * 0.01,
    borderBottomWidth: 0.5,
    borderColor: COLORS.base,
    // alignItems: 'center',
  },
});
