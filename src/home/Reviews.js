import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import FONTS from '../theme/Fonts';
import COLORS from '../theme/Colors';
import {Rating, AirbnbRating} from 'react-native-ratings';
import Button from '../components/Button';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {addReview} from '../restapi/ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {height, width, fontScale} = Dimensions.get('screen');
const Reviews = ({route}) => {
  const navigation = useNavigation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const {detail} = route.params || {};
  // console.log('detailReEVIEWW', detail);

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
      RatingApi();
    }
  };

  //Api for Rating
  const RatingApi = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios({
        method: 'POST',
        url: addReview,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          rating: comment,
          review: rating,
          product_id: '2',
        },
      });
      // console.log('review Res---', response?.data);
      if (response?.data?.status === true) {
        showMessage({
          message: response?.data?.message,
          type: 'success',
        });
        navigation?.navigate('BottomTabNavigation');
      }
    } catch (error) {
      // console.log('Error Rating', error?.response?.data);
    }
  };
  return (
    <>
      <View
        style={{
          backgroundColor: COLORS.white,
          flex: 1,
          padding: 20,
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
            disabled={rating === 0 || comment.trim() === ''}
          />
        </View>
      </View>
    </>
  );
};

export default Reviews;

const styles = StyleSheet.create({
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
