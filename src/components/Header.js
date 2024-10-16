import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';

const {height, width, fontScale} = Dimensions.get('screen');

const Header = ({headerText, tintColor, backicon,backgroundColor,textcolor}) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        paddingVertical: height*0.02,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor:backgroundColor
      }}>
      <TouchableOpacity
        style={{height: 20, width: 20}}
        onPress={() => {
          navigation.goBack();
        }}>
        {backicon && (
          <Image
            source={require('../assets/images/icons/backicon.png')}
            style={{
              height: 20,
              width: 20,
              marginLeft: 10,
              tintColor: tintColor,
            }}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
      <Text style={[styles.text,{color:textcolor?textcolor:COLORS.white}]}>{headerText}</Text>
      <View style={{height: 24, width: 24, marginLeft: 10}}></View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  text: {
    fontSize: fontScale * 18,
    color: COLORS.white,
    lineHeight: 25,
    fontFamily: FONTS.Inter500,
  },
});
