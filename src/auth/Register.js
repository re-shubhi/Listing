import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import {CommonActions, useNavigation} from '@react-navigation/native';
import Button from '../components/Button';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {showMessage} from 'react-native-flash-message';
import Phone from '../components/Phone';
import axios from 'axios';
import {ServerUrl, register} from '../restapi/ApiConfig';
import ScreenLoader from '../components/ScreenLoader';
import {useTranslation} from 'react-i18next';
import {I18nManager} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translateText } from '../../services/translationService';

const {height, width, fontScale} = Dimensions.get('screen');

const Register = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const isRTL = I18nManager.isRTL;
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('Name is too short!'))
      .required(t('Name is required.')),
    email: Yup.string()
      .email(t('Invalid email'))
      .required(t('Email is required'))
      .matches(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        t('Invalid email'),
      ),
    phoneNumber: Yup.string()
      .required(t('Phone number is required.'))
      .min(8, t('Phone number must be atleast 8 characters.'))
      .max(15, t('Phone number must be atmost 15 characters.'))
      .matches(/^\d+$/, t('Invalid phone number. Only digits are allowed.')),
    password: Yup.string()
      .required(t('Password is required'))
      .min(8, t('Password must be atleast 8 characters.')),
    // .matches(
    //   /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    //   'Password must contain minimum 8 characters including atleast 1 uppercase letter, 1 lowercase letter and 1 special character.',
    // ),
    confirmPassword: Yup.string()
      .required(t('Confirmation of your password is required.'))
      .oneOf(
        [Yup.ref('password'), null],
        t('Confirm Password should match with New Password.'),
      ),
  });
  const [secure, setSecure] = useState({password: true, confirmPassword: true});
  const [loader, setLoader] = useState(false);
  const [countryCode, setCountryCode] = useState({
    callingCode: '966',
    cca2: '🇸🇦',
  });
  const toggleSecure = field => {
    setSecure(prevSecure => ({...prevSecure, [field]: !prevSecure[field]}));
  };
  //api for register
  const RegisterApi = async values => {
    console.log('values-----', values);
    // console.log("callingCode",countryCode)
    const lang = await AsyncStorage.getItem('languageSelected') || 'en';
    try {
      setLoader(true);
      const response = await axios({
        method: 'POST',
        url: register,
        data: {
          name: values.username,
          email: values.email,
          phone_code: countryCode?.callingCode,
          mobile: values.phoneNumber,
          password: values.confirmPassword,
          deviceType: Platform.OS == 'ios' ? '2' : '1',
        },
      });
      // console.log('response---', response?.data);
      const message = await translateText(response?.data?.message,lang)
      if (response?.data?.status == true) {
        setLoader(false);
        showMessage({
          message: message,
          type: 'success',
          style:{alignItems:'flex-start'}
        });
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {name: 'VerifyOtp', params: {userId: response?.data?.userId}},
            ],
          }),
        );
      }
    } catch (error) {
      // console.log('error Register', error?.response);
      setLoader(false);
      if (error?.response?.data?.status === false) {
        const message = await translateText(error?.response?.data?.message,lang)
        showMessage({
          message: message,
          type: 'danger',
          style:{alignItems:'flex-start'}
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 100 : 'height'}
        style={{flex: 1}}>
        <Header backicon />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Formik
            initialValues={{
              email: '',
              phoneNumber: '',
              password: '',
              username: '',
              confirmPassword: '',
            }}
            validationSchema={validationSchema}
            onSubmit={values => {
              // console.log('values', values);
              RegisterApi(values);
            }}>
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <View style={styles.container}>
                <View style={styles.TextContainer}>
                  <Text style={styles.heading}>
                    {t('Hello! Register to get started')}
                  </Text>
                </View>
                <View style={{marginVertical: 10}}>
                  <TextInput
                    style={[
                      styles.textinput,
                      {textAlign: isRTL ? 'right' : 'left'},
                    ]}
                    placeholder={t('Name')}
                    placeholderTextColor={COLORS.placeholder}
                    value={values.username}
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    maxLength={60}
                  />
                  {errors.username && touched.username && (
                    <Text
                      style={[
                        styles.errorText,
                        {alignSelf: isRTL ? 'flex-start' : 'flex-end'},
                      ]}>
                      {errors.username}
                    </Text>
                  )}
                </View>
                <View style={{marginBottom: 10}}>
                  <TextInput
                    style={[
                      styles.textinput,
                      {textAlign: isRTL ? 'right' : 'left'},
                    ]}
                    placeholder={t('Email')}
                    placeholderTextColor={COLORS.placeholder}
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    maxLength={60}
                  />
                  {errors.email && touched.email && (
                    <Text
                      style={[
                        styles.errorText,
                        {alignSelf: isRTL ? 'flex-start' : 'flex-end'},
                      ]}>
                      {errors.email}
                    </Text>
                  )}
                </View>
                <Phone
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  values={values.phoneNumber}
                  setCountryCode={setCountryCode}
                  countryCode={countryCode}
                />
                <View style={[styles.textinputPassword, {marginTop: 10}]}>
                  <TextInput
                    style={[
                      styles.textinput,
                      {
                        flex: 1,
                        borderWidth: 0,
                        borderColor: 'transparent',
                        textAlign: isRTL ? 'right' : 'left',
                      },
                    ]}
                    placeholder={t('Password')}
                    placeholderTextColor={COLORS.placeholder}
                    secureTextEntry={secure.password}
                    value={values.password}
                    maxLength={15}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      toggleSecure('password');
                    }}>
                    <Image
                      source={
                        secure.password
                          ? require('../assets/images/icons/eye-off.png')
                          : require('../assets/images/icons/eye.png')
                      }
                      style={{height: 20, width: 20, tintColor: COLORS.heading}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && touched.password && (
                  <Text style={[styles.errorText,{alignSelf: isRTL ? 'flex-start' : 'flex-end'}]}>{errors.password}</Text>
                )}
                <View style={[styles.textinputPassword, {marginTop: 10}]}>
                  <TextInput
                    style={[
                      styles.textinput,
                      {
                        flex: 1,
                        borderWidth: 0,
                        borderColor: 'transparent',
                        textAlign: isRTL ? 'right' : 'left',
                      },
                    ]}
                    placeholder={t('Confirm Password')}
                    placeholderTextColor={COLORS.placeholder}
                    secureTextEntry={secure.confirmPassword}
                    value={values.confirmPassword}
                    maxLength={15}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      toggleSecure('confirmPassword');
                    }}>
                    <Image
                      source={
                        secure.confirmPassword
                          ? require('../assets/images/icons/eye-off.png')
                          : require('../assets/images/icons/eye.png')
                      }
                      style={{height: 20, width: 20, tintColor: COLORS.heading}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && touched.confirmPassword && (
                  <Text style={[styles.errorText,{alignSelf: isRTL ? 'flex-start' : 'flex-end'}]}>{errors.confirmPassword}</Text>
                )}
                <View style={{marginTop: 15}}>
                  <Button buttonTxt={t('Register')} onPress={handleSubmit} />
                </View>
              </View>
            )}
          </Formik>
          <View style={styles.registerLink}>
            <Text
              style={[
                styles.linkText,
                {color: COLORS.black, fontFamily: FONTS.Inter400},
              ]}>
              {t('Already have an account ?')}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
              }}>
              <Text style={styles.linkText}> {t('Login Now')}</Text>
            </TouchableOpacity>
          </View>
          {loader && <ScreenLoader isProcessing={loader} />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: COLORS.primary, paddingBottom: 20},
  container: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 22,
    marginTop: Platform.OS === 'ios' ? height * 0.05 : height * 0.038,
  },
  scrollView: {
    flexGrow: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 200,
  },
  heading: {
    color: COLORS.heading,
    fontSize: fontScale * 30,
    textAlign: 'left',
    fontFamily: FONTS.Inter600,
    letterSpacing: 0.3,
  },
  TextContainer: {
    marginRight: width * 0.1,
    marginBottom: 10,
  },
  textinput: {
    backgroundColor: COLORS.white,
    paddingVertical: Platform.OS === 'ios' ? 20 : height * 0.014,
    borderRadius: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    fontSize: fontScale * 16,
    fontFamily: FONTS.Inter400,
    color: COLORS.black,
  },
  textinputPassword: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    paddingRight: 10,
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
    bottom: Platform.OS === 'ios' ? 30 : 45,
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
});
