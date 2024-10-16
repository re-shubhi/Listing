import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  I18nManager,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import {CommonActions, useNavigation} from '@react-navigation/native';
import Button from '../components/Button';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import {otpVerify, resendOtp} from '../restapi/ApiConfig';
import ScreenLoader from '../components/ScreenLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import { translateText } from '../../services/translationService';

const {height, width, fontScale} = Dimensions.get('screen');

const VerifyOtp = ({route}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const isRTL = I18nManager.isRTL;
  const userId = route?.params?.userId;
  const CELL_COUNT = 4;
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loader, setLoader] = useState(false);
  const codeInputRef = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleContinue = () => {
    if (value.length !== CELL_COUNT) {
      setError('OTP must be 4 digits');
    } else {
      setError('');
      OtpVerifyApi();
    }
  };
  const handleChangeText = otp => {
    setValue(otp);
    if (otp.length !== CELL_COUNT) {
      setError(t('OTP must be 4 digits'));
    } else {
      setError('');
      // console.log('Otp--', otp);
      setValue(otp);
    }
  };
  // Otp verification Api
  const OtpVerifyApi = async () => {
    const lang = await AsyncStorage.getItem('languageSelected') || 'en';
    try {
      setLoader(true);
      const response = await axios({
        method: 'POST',
        url: otpVerify,
        data: {
          otp: value,
          userId: userId,
        },
      });
      // console.log('res---', response);
      if (response?.data?.status === true) {
        const message = await translateText(response?.data?.message,lang)
        await AsyncStorage.setItem('userStatus', 'registered');
        setLoader(false);
        showMessage({
          message: message,
          type: 'success',
          style:{alignItems:'flex-start'}
        });
        navigation?.dispatch(
          CommonActions?.reset({
            index: 0,
            routes: [{name: 'Login'}],
          }),
        );
      }
    } catch (error) {
      // console.log('Error Otp', error);
      if (error?.response?.data?.status === false) {
        const message = await translateText(error?.response?.data?.message,lang)
        setLoader(false);
        showMessage({
          message: message,
          type: 'danger',
          style:{alignItems:'flex-start'}
        });
      }
    }
  };

  // Otp Resend Api
  const ResendOtp = async () => {
    const lang = await AsyncStorage.getItem('languageSelected') || 'en';
    try {
      setLoader(true);
      const response = await axios({
        method: 'POST',
        url: resendOtp,
        data: {
          userId: userId,
        },
      });
      // console.log('Resend res--', response);
      if (response?.data?.status === true) {
        const message = await translateText(response?.data?.message,lang)
        setLoader(false);
        showMessage({
          message: message,
          type: 'success',
          style:{alignItems:'flex-start'}
        });
      }
    } catch (error) {
      // console.log('error--', error);
      setLoader(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <Header backicon />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.TextContainer}>
              <Text
                style={[
                  styles.heading,
                  {alignSelf: isRTL ? 'flex-start' : 'flex-end'},
                ]}>
                {t('Enter 4 digit code')}
              </Text>
              <Text
                style={[
                  styles.subheading,
                  {alignSelf: isRTL ? 'flex-start' : 'flex-end'},
                ]}>
                {t('Enter the 4 digit code that you received on your email')}
              </Text>
            </View>
            <View>
              <CodeField
                ref={codeInputRef}
                {...props}
                value={value}
                onChangeText={handleChangeText}
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
            {error ? (
              <Text
                style={[
                  styles.errorText,
                  {alignSelf: isRTL ? 'flex-start' : 'flex-end'},
                ]}>
                {error}
              </Text>
            ) : null}
            <View style={{marginTop: 10}}>
              <Button
                buttonTxt={t('Continue')}
                disabled={value.length != CELL_COUNT}
                onPress={handleContinue}
              />
            </View>
            <View style={styles.forgotView}>
              <TouchableOpacity onPress={ResendOtp}>
                <Text style={styles.forgotText}>{t('Resend OTP')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {loader && <ScreenLoader isProcessing={loader} />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerifyOtp;

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
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 200,
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
  },
  registerLink: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 5 : 22,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  linkText: {
    fontSize: fontScale * 16,
    color: COLORS.white,
    fontFamily: FONTS.Inter500,
  },
  root: {flex: 1},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginVertical: 15, alignSelf: 'center'},
  cell: {
    width: 60,
    height: 60,
    fontSize: fontScale * 20,
    borderWidth: 1,
    borderColor: Platform.OS === 'ios' ? COLORS.base : COLORS.borderColor,
    borderRadius: 10,
    textAlign: 'center',
    color: COLORS.black,
    fontFamily: FONTS.Inter600,
    lineHeight: 55,
    marginHorizontal: 10,
  },

  focusCell: {
    borderColor: '#000',
    paddingHorizontal: 10,
  },
  forgotView: {
    paddingTop: 20,
    alignItems: 'flex-end',
  },
  forgotText: {
    fontSize: fontScale * 14,
    color: COLORS.heading,
    fontFamily: FONTS.Inter400,
  },
});
