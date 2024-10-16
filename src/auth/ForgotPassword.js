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
import {useNavigation} from '@react-navigation/native';
import Button from '../components/Button';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import {forgotpassword_send_request} from '../restapi/ApiConfig';
import ScreenLoader from '../components/ScreenLoader';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translateText } from '../../services/translationService';

const {height, width, fontScale} = Dimensions.get('screen');

const ForgotPassword = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [loader, setLoader] = useState(false);
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('Invalid email'))
      .required(t('Email is required'))
      .matches(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        t('Invalid email'),
      ),
  });

  //ForgotPassword Api
  const PasswordForgot = async values => {
    const lang = await AsyncStorage.getItem('languageSelected') || 'en';
    // console.log('EMAIL', values);
    try {
      setLoader(true);
      const response = await axios({
        method: 'POST',
        url: forgotpassword_send_request,
        data: {
          email: values.email,
        },
      });
      // console.log('Response Email', response);
      if (response?.data?.status === true) {
        const message = await translateText(response?.data?.message,lang)
        setLoader(false);
        showMessage({
          message: message,
          type: 'success',
          style:{alignItems:'flex-start'}
        });
        navigation?.navigate('OtpScreen',{tempId:response?.data?.tempId,email:response?.data?.email});
      }
    } catch (error) {
      // console.log('Errorr Forgot', error);
      if (error?.response?.data?.status === false) {
        const message = await translateText(error?.response?.data?.message,lang)
        setLoader(false);
        showMessage({
          message:message ,
          type: 'danger',
          style:{alignItems:'flex-start'}
        });
      }
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
          <Formik
            initialValues={{email: ''}}
            validationSchema={validationSchema}
            onSubmit={values => {
              PasswordForgot(values);
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
                  <Text style={styles.heading}>{t("Reset your password")}</Text>
                  <Text style={[styles.subheading,{alignSelf:isRTL?'flex-start':'flex-end'}]}>
                    {t("Enter your email for the varification proccess will we send 4 digit code your email")}
                  </Text>
                </View>
                <View style={styles.textinputBox}>
                  <TextInput
                    style={[styles.textinput,{textAlign:isRTL?'right':'left'}]}
                    placeholder={t("Email")}
                    placeholderTextColor={COLORS.placeholder}
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    maxLength={60}
                  />
                  {errors.email && touched.email && (
                    <Text style={[styles.errorText,{alignSelf: isRTL ? 'flex-start' : 'flex-end'}]}>{errors.email}</Text>
                  )}
                </View>
                <View style={{marginTop: 10}}>
                  <Button buttonTxt={t('Continue')} onPress={handleSubmit} />
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

export default ForgotPassword;

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: COLORS.primary},
  container: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 22,
    marginTop: height * 0.08,
  },
  scrollView: {
    flex: 1,
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
  textinput: {
    backgroundColor: COLORS.white,
    paddingVertical: Platform.OS === 'ios' ? 20 : height * 0.012,
    borderRadius: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    fontSize: fontScale * 17,
    fontFamily: FONTS.Inter400,
    color: COLORS.black,
  },
  textinputBox: {
    paddingVertical: 15,
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
    bottom: Platform.OS === 'ios' ? 5 : 22,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  linkText: {
    fontSize: fontScale * 15,
    color: COLORS.white,
    fontFamily: FONTS.Inter500,
  },
});
