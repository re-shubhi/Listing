import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useContext, useState} from 'react';
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

const Tab = createMaterialTopTabNavigator();
const {height, width, fontScale} = Dimensions.get('screen');

export default function MidTabs(props) {
  const {ProductListing} = useContext(AuthContext);
  const [expand, setExpand] = useState(false);
  const toggleExpand = () => {
    setExpand(!expand);
  };
  const About = () => {
    return (
      <ScrollView style={{padding: 20, flex: 1, paddingBottom: 50}}>
        <View>
          <View>
            {expand ? (
              <View>
                <HTMLView value={detail?.[0]?.about_product} />
                <TouchableOpacity onPress={toggleExpand}>
                  <Text style={styles.seeText}>See less</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <HTMLView value={detail?.[0]?.about_product.slice(0, 300)} />
                <TouchableOpacity onPress={toggleExpand}>
                  <Text style={styles.seeText}>See More</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={{marginTop: height * 0.02}}>
            <Button buttonTxt={'Call for more information'} />
          </View>
        </View>
      </ScrollView>
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
      setRating(rating);
    };
    const handleCommentChange = text => {
      setComment(text);
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
      try {
        setLoader(true);
        const response = await axios({
          method: 'POST',
          url: addReview,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            rating: comment,
            review: rating,
            product_id: detail?.[0]?.category_id,
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
      }
    };
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
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
              onPress={handleSubmit}
              disabled={rating === 0}
            />
          </View>
        </View>
        {loader && <ScreenLoader isProcessing={loader} />}
      </ScrollView>
    );
  };

  return (
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
});
