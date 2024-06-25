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
import { useNavigation } from '@react-navigation/native';

const {height, width, fontScale} = Dimensions.get('screen');
const Reviews = () => {
  const [comment, setComment] = useState('');
  const navigation = useNavigation();
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
        />
        <Text style={styles.subText}>Your Feedback is anonymous</Text>
        <TextInput
          style={styles.textinput}
          placeholder="Comment here"
          placeholderTextColor={COLORS.placeholder}
          textAlignVertical='top'
          multiline={true}
          numberOfLines={4}
          value={comment}
          onChangeText={text => {
            console.log('COMMMENTTT', text);
            setComment(text);
          }}
        />
        <View style={{paddingVertical: height * 0.01}}>
          <Button
            buttonTxt={'Submit'}
            onPress={() =>
              {{
                console.log("Submitted");
                showMessage({
                  message: 'Review submitted succesfully',
                  type: 'success',
                })
                navigation.navigate("BottomTabNavigation")
              }}
            }
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
});
