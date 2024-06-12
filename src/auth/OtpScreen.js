import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import {useNavigation} from '@react-navigation/native';
import Button from '../components/Button';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const {height, width, fontScale} = Dimensions.get('screen');

const OtpScreen = () => {
  const navigation = useNavigation();
  const CELL_COUNT = 4;
  const [value, setValue] = useState('');
  const codeInputRef = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <SafeAreaView style={styles.screen}>
      <Header  backicon/>

      <View style={styles.container}>
        <View style={styles.TextContainer}>
          <Text style={styles.heading}>Enter 4 digit code</Text>
          <Text style={styles.subheading}>
            Enter the 4 digit code that you received on your email
          </Text>
        </View>
        <View>
          <CodeField
            ref={codeInputRef}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete={Platform.select({
              android: 'sms-otp',
              default: 'one-time-code',
            })}
            testID="my-code-input"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
        </View>
        <View style={{marginTop: 10}}>
          <Button
            buttonTxt={'Continue'}
            onPress={() => {
              console.log('CONTINUE',value);
              navigation.navigate('ResetPassword');
            }}
          />
        </View>
        <View style={styles.forgotView}>
          <TouchableOpacity
            onPress={() => {
              console.log('RESEND');
            }}>
            <Text style={styles.forgotText}>Resend OTP</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.registerLink}>
        <Text
          style={[
            styles.linkText,
            {color: COLORS.black, fontFamily: FONTS.Inter400},
          ]}>
          Already have an account ?
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login');
          }}>
          <Text style={styles.linkText}> Login Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: COLORS.primary},
  container: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginTop: height * 0.08,
  },
  heading: {
    color: COLORS.heading,
    fontSize: fontScale * 30,
    textAlign: 'left',
    fontFamily: FONTS.Inter600,
    letterSpacing: 0.3,
  },
  TextContainer: {
    marginRight: width * 0.12,
    marginBottom: 10,
  },
  subheading: {
    fontSize: fontScale * 14,
    fontFamily: FONTS.Inter400,
    color: COLORS.heading,
    letterSpacing: 0.3,
    paddingTop: 5,
  },
  codeinput: {
    color: COLORS.red,
    fontFamily: FONTS.Inter500,
    fontSize: fontScale * 16,
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
  },
  errorText: {
    fontSize: fontScale * 12,
    fontFamily: FONTS.Inter500,
    color: COLORS.red,
    paddingLeft: 5,
    marginTop: 5,
  },
  registerLink: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 28,
  },
  linkText: {
    fontSize: fontScale * 16,
    color: COLORS.white,
    fontFamily: FONTS.Inter500,
  },
  root: {flex: 1},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginVertical: 15, marginHorizontal: 30},
  cell: {
    width: 60,
    height: 60,
    fontSize: fontScale * 20,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 10,
    textAlign: 'center',
    color: COLORS.black,
    fontFamily: FONTS.Inter600,
    lineHeight: 55,
  },
  focusCell: {
    borderColor: '#000',
  },
  forgotView: {
    paddingTop: 20,
    alignItems: 'flex-end',
  },
  forgotText: {
    fontSize: fontScale * 16,
    color: COLORS.heading,
    fontFamily: FONTS.Inter400,
  },
});
