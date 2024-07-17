import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Reviews from './Reviews';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FONTS from '../theme/Fonts';
import COLORS from '../theme/Colors';
import Button from '../components/Button';
import HTMLView from 'react-native-htmlview';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {addReview} from '../restapi/ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';
import ScreenLoader from '../components/ScreenLoader';
import {AuthContext} from '../restapi/AuthContext';
import GuestModal from '../components/GuestModal';

const Tab = createMaterialTopTabNavigator();
const {height, width, fontScale} = Dimensions.get('screen');

export default function MidTabs(props) {
  const navigation = useNavigation();
  const {ProductListing} = useContext(AuthContext);
  const [expand, setExpand] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const toggleExpand = () => {
    setExpand(!expand);
  };
  const showGuestModal = () => {
    setShowModal(true);
  };
  // Function to hide the guest registration modal
  const hideGuestModal = () => {
    setShowModal(false);
  };
  const checkGuest = async () => {
    const token = await AsyncStorage.getItem('token');
    token ? setIsGuest(false) : setIsGuest(true);
  };

  const About = () => {
    return (
      <>
        <ScrollView
          style={{padding: 20, flex: 1, paddingBottom: 50}}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <View>
            <View>
              {expand ? (
                <View>
                  <HTMLView
                    value={detail?.[0]?.about_product}
                    stylesheet={styles}
                  />
                  <TouchableOpacity onPress={toggleExpand}>
                    <Text style={styles.seeText}>See less</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <HTMLView
                    value={detail?.[0]?.about_product.slice(0, 300)}
                    stylesheet={styles}
                  />
                  <TouchableOpacity onPress={toggleExpand}>
                    <Text style={styles.seeText}>See More</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={{marginTop: height * 0.02}}>
              <Button
                buttonTxt={'Call for more information'}
                onPress={() => {
                  isGuest
                    ? showGuestModal()
                    : showMessage({
                        message: 'calling',
                        type: 'info',
                      });
                }}
              />
            </View>
          </View>
        </ScrollView>
        <GuestModal
          visible={showModal}
          onClose={hideGuestModal}
          navigation={navigation}
        />
      </>
    );
  };
  const {detail} = props?.route?.params;
  console.log('DETAILS', detail);

  const Review = () => {
    const navigation = useNavigation();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [loader, setLoader] = useState(false);

    const handleRatingChange = rating => {
      if (isGuest) {
        showGuestModal();
      } else setRating(rating);
    };
    const handleCommentChange = text => {
      if (isGuest) {
        showGuestModal();
      } else setComment(text);
    };
    const handleSubmit = () => {
      if (comment === '') {
        setError('Please enter your comment');
      } else {
        setError('');
        RatingApi();
      }
    };

    //Api for Rating
    const RatingApi = async () => {
      const token = await AsyncStorage.getItem('token');
      console.log('tokentoken', token);
      try {
        setLoader(true);
        const response = await axios({
          method: 'POST',
          url: addReview,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            rating: rating,
            review: comment,
            product_id: detail?.[0]?.id,
          },
        });
        console.log('review Res---', response?.data);
        if (response?.data?.status === true) {
          setLoader(false);
          showMessage({
            message: response?.data?.message,
            type: 'success',
          });
          await ProductListing();
          navigation?.navigate('BottomTabNavigation');
        }
      } catch (error) {
        console.log('Error Rating', error?.response?.data);
        setLoader(false);
        if (error?.response?.data?.message === 'Unauthenticated.') {
          showGuestModal();
        }
      }
    };

    return (
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          // onTouchEnd={() => Keyboard.dismiss()}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              flex: 1,
              padding: 20,
              paddingBottom: 50,
            }}>
            <Text style={styles.textheading}>How was your Service ?</Text>
            <AirbnbRating
              defaultRating={0}
              count={5}
              size={20}
              starImage={require('../assets/images/icons/star2.png')}
              selectedColor={COLORS.primary}
              unSelectedColor={COLORS.base}
              reviewSize={0}
              showRating={false}
              starContainerStyle={{
                marginVertical: height * 0.02,
                columnGap: 8,
              }}
              onFinishRating={handleRatingChange}
            />
            <Text style={styles.subText}>Your Feedback is anonymous</Text>
            <TextInput
              style={styles.textinput}
              placeholder="Comment here"
              placeholderTextColor={COLORS.placeholder}
              textAlignVertical="top"
              multiline={true}
              numberOfLines={4}
              value={comment}
              onChangeText={handleCommentChange}
            />
            <Text style={styles.errorText}>{error}</Text>
            <View style={{paddingVertical: height * 0.01}}>
              <Button
                buttonTxt={'Submit'}
                onPress={isGuest ? showGuestModal : handleSubmit}
                // disabled={rating === 0}
              />
            </View>
          </View>
          {loader && <ScreenLoader isProcessing={loader} />}
        </ScrollView>
        <GuestModal
          visible={showModal}
          onClose={hideGuestModal}
          navigation={navigation}
        />
      </>
    );
  };

  useEffect(() => {
    // Check user status from AsyncStorage
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
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarInactiveTintColor: COLORS.base,
          tabBarActiveTintColor: COLORS.primary,

          tabBarLabelStyle: {
            textTransform: 'capitalize',
            fontSize: fontScale * 15,
            fontFamily: FONTS.Inter500,
          },

          tabBarStyle: {
            backgroundColor: '#F7F7F7',
            elevation: 0,
          },
          tabBarIndicatorStyle: {
            backgroundColor: COLORS.primary, // Set the color of the indicator
            height: 3,
          },
        }}>
        <Tab.Screen name="About" component={About} />
        <Tab.Screen
          name="Reviews"
          component={Review}
          initialParams={{detail: detail?.[0]}}
        />
      </Tab.Navigator>
    </>
  );
}
const styles = StyleSheet.create({
  text: {
    fontSize: fontScale * 14,
    color: COLORS.black,
    fontFamily: FONTS.Inter400,
    letterSpacing: 0.3,
  },
  seeText: {
    color: COLORS.primary,
    fontSize: fontScale * 13,
    fontFamily: FONTS.Inter400,
    letterSpacing: 0.3,
    top: Platform.OS === 'ios' ? 3 : 5,
  },
  textheading: {
    fontSize: fontScale * 17,
    fontFamily: FONTS.Inter500,
    color: COLORS.black,
    alignSelf: 'center',
  },
  subText: {
    fontSize: fontScale * 14,
    fontFamily: FONTS.Inter400,
    color: COLORS.black,
    alignSelf: 'center',
  },
  textinput: {
    backgroundColor: COLORS.white,
    paddingVertical: Platform.OS === 'ios' ? 20 : 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    fontSize: fontScale * 17,
    fontFamily: FONTS.Inter400,
    color: COLORS.black,
    marginTop: height * 0.03,
    minHeight: 100, // Ensure a minimum height for the TextInput
    maxHeight: 120,
  },
  errorText: {
    fontSize: fontScale * 12,
    fontFamily: FONTS.Inter500,
    color: COLORS.red,
    paddingLeft: 5,
    marginTop: Platform.OS === 'ios' ? 5 : 2,
  },
  p: {
    color: COLORS?.black,
    fontSize: fontScale * 14,
    fontFamily: FONTS?.Inter400,
  },
  modalClose: {
    alignSelf: 'flex-end',
  },
});
