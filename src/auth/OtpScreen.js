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
import {
  forgotpassword_otp_verify,
  forgotpassword_send_request,
} from '../restapi/ApiConfig';
import ScreenLoader from '../components/ScreenLoader';

const {height, width, fontScale} = Dimensions.get('screen');

const OtpScreen = ({route}) => {
  const navigation = useNavigation();
  const {tempId, email} = route?.params;
  console.log('emailll', email, tempId);
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
    if (value.length != CELL_COUNT) {
      setError('OTP must be 4 digits');
    } else {
      setError('');
      OtpVerifyApi();
    }
  };

  const handleChangeText = otp => {
    setValue(otp);
    if (otp.length !== CELL_COUNT) {
      setError('OTP must be 4 digits');
    } else {
      setError('');
      console.log('Otp--', otp);
      setValue(otp);
    }
  };

  //Otp verification Api
  const OtpVerifyApi = async () => {
    try {
      setLoader(true);
      const response = await axios({
        method: 'POST',
        url: forgotpassword_otp_verify,
        data: {
          tempId: tempId,
          otp: value,
        },
      });
      console.log('OTP res--', response);
      if (response?.data?.status === true) {
        setLoader(false);
        showMessage({
          message: response?.data?.message,
          type: 'success',
        });
        navigation?.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'ResetPassword', params: {tempId: tempId}}],
          }),
        );
      }
    } catch (error) {
      console.log('error', error);
      setLoader(false);
      if (error?.response?.data?.status === false) {
        showMessage({
          message: error?.response?.data?.message,
          type: 'danger',
        });
      }
    }
  };

  //Resend Otp Api
  const ResendApi = async () => {
    try {
      setLoader(true)
      const response = await axios({
        method: 'POST',
        url: forgotpassword_send_request,
        data: {email: email},
      });
      console.log('resend Res--', response);
      if(response?.data?.status === true)
        {
          setLoader(false)
          showMessage({
            message:response?.data?.message,
            type:'success'
          })
        }
    } catch (error) {
      console.log('Error', error);
      setLoader(false)
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
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <View style={{marginTop: 10}}>
              <Button
                buttonTxt={'Continue'}
                disabled={value.length != CELL_COUNT}
                onPress={handleContinue}
              />
            </View>
            <View style={styles.forgotView}>
              <TouchableOpacity
                onPress={() => {
                  ResendApi();
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
          {loader && <ScreenLoader isProcessing={loader} />}
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginTop: 5,
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
