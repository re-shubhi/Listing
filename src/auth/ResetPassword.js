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
  KeyboardAvoidingView,
  ScrollView,
  I18nManager,
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
import axios from 'axios';
import {reset_password} from '../restapi/ApiConfig';
import ScreenLoader from '../components/ScreenLoader';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translateText } from '../../services/translationService';

const {height, width, fontScale} = Dimensions.get('screen');

const ResetPassword = ({route}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const isRTL = I18nManager.isRTL;
  const tempId = route?.params?.tempId;
  const validationSchema = Yup.object().shape({
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

  const [loader, setLoader] = useState(false);
  const [secure, setSecure] = useState({password: true, confirmPassword: true});

  const toggleSecure = field => {
    setSecure(prevSecure => ({...prevSecure, [field]: !prevSecure[field]}));
  };

  const PasswordResetApi = async values => {
    const lang = await AsyncStorage.getItem('languageSelected') || 'en';
    try {
      setLoader(true);
      const response = await axios({
        method: 'POST',
        url: reset_password,
        data: {
          tempId: tempId,
          password: values.password,
          password_confirmation: values.confirmPassword,
        },
      });
      // console.log('Reset Res--', response);
      if (response?.data?.status === true) {
        const message = await translateText(response?.data?.message,lang)
        setLoader(false);
        showMessage({
          message:message,
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
      // console.log('error', error);
      setLoader(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Header backicon />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Formik
            initialValues={{
              password: '',
              confirmPassword: '',
            }}
            validationSchema={validationSchema}
            onSubmit={values => {
              PasswordResetApi(values);
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
                  <Text style={[styles.heading,{alignSelf: isRTL ? 'flex-start' : 'flex-end'}]}>{t('Reset Password')}</Text>
                  <Text style={[styles.subheading,{alignSelf: isRTL ? 'flex-start' : 'flex-end'}]}>
                    {t(
                      'Set the new password for your account so you can login and access all the features.',
                    )}
                  </Text>
                </View>
                <View style={styles.textinputPassword}>
                  <TextInput
                    style={[
                      styles.textinput,
                      {
                        flex: 1,
                        borderWidth: 0,
                        borderColor: 'transparent',
                        textAlign: isRTL ? 'right' : 'left'
                      },
                    ]}
                    placeholder={t("Password")}
                    placeholderTextColor={COLORS.placeholder}
                    secureTextEntry={secure.password}
                    value={values.password}
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
                        textAlign: isRTL ? 'right' : 'left'
                      },
                    ]}
                    placeholder={t("Confirm Password")}
                    placeholderTextColor={COLORS.placeholder}
                    secureTextEntry={secure.confirmPassword}
                    value={values.confirmPassword}
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
                  <Button buttonTxt={t('Reset Password')} onPress={handleSubmit} />
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
              {t("Already have an account ?")}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
              }}>
              <Text style={styles.linkText}> {t("Login Now")}</Text>
            </TouchableOpacity>
          </View>
          {loader && <ScreenLoader isProcessing={loader} />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: COLORS.primary, paddingBottom: 20},
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
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 200,
  },
  textinput: {
    backgroundColor: COLORS.white,
    paddingVertical: Platform.OS === 'ios' ? 20 : height * 0.012,
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
    marginTop: Platform.OS === 'ios' ? 5 : 2,
  },
  registerLink: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 5 : 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 22,
  },
  linkText: {
    fontSize: fontScale * 16,
    color: COLORS.white,
    fontFamily: FONTS.Inter500,
  },
  subheading: {
    fontSize: fontScale * 14,
    fontFamily: FONTS.Inter400,
    color: COLORS.heading,
    letterSpacing: 0.3,
    paddingTop: 5,
  },
});
