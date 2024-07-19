import React, {useEffect, useState} from 'react';
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
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  BackHandler,
  Alert,
} from 'react-native';
import {
  CommonActions,
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import Button from '../components/Button';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import {login} from '../restapi/ApiConfig';
import ScreenLoader from '../components/ScreenLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

const {height, width, fontScale} = Dimensions.get('screen');

const Login = props => {
  const navigation = useNavigation();
  const isfocus = useIsFocused();
  const [secure, setSecure] = useState(true);
  const [loader, setLoader] = useState(false);
  const [deviceToken, setDeviceToken] = useState('');
  // console.log('🚀 ~ Login ~ deviceToken:', deviceToken);
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required')
      .matches(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Invalid email',
      ),
    password: Yup.string()
      .required('Password is required')
      .min(8,"Password must be atleast 8 characters."),
      // .matches(
      //   /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      //   'Password must contain minimum 8 characters including atleast 1 uppercase letter, 1 lowercase letter and 1 special character.',
      // ),
  });
  const backButtonHandler = () => {
    Alert.alert(
      'Exit App',
      'Are you sure you want to exit the app?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Exit',
          onPress: () => BackHandler.exitApp(),
        },
      ],
      {
        cancelable: false,
      },
    );
    return true;
  };
  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', backButtonHandler);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
      };
    }, []),
  );

  const getDeviceToken = () => {
    var uniqueId = DeviceInfo?.getUniqueIdSync();
    setDeviceToken(uniqueId);
  };

  //Login Api
  const LoginApi = async values => {
    try {
      setLoader(true);
      const response = await axios({
        method: 'POST',
        url: login,
        data: {
          email: values.email,
          password: values.password,
          deviceToken: deviceToken,
        },
      });
      // console.log('Login Res----', response);
      if (response?.data?.status === true) {
        setLoader(false);
        await AsyncStorage.setItem('token', response?.data?.token);
        await AsyncStorage.setItem('userStatus', 'registered');
        showMessage({
          message: response?.data?.message,
          type: 'success',
        });
        navigation?.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'BottomTabNavigation'}],
          }),
        );
      }
    } catch (error) {
      // console.log('Login error---', error);
      setLoader(false);
      if (error?.response?.data?.status === false) {
        showMessage({
          message: error?.response?.data?.message,
          type: 'danger',
        });
      }
    }
  };

  useEffect(() => {
    getDeviceToken();
  }, [isfocus]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar backgroundColor={COLORS.primary} barStyle={'dark-content'} />
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
            initialValues={{email: '', password: ''}}
            validationSchema={validationSchema}
            onSubmit={values => {
              // console.log('Valuesss--', values);
              LoginApi(values);
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
                <View style={styles.textinputBox}>
                  <Text style={styles.heading}>
                    Welcome Back! Glad to see you, again
                  </Text>
                </View>
                <View style={styles.textinputBox}>
                  <TextInput
                    style={styles.textinput}
                    placeholder="Enter your email"
                    placeholderTextColor={COLORS.placeholder}
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    maxLength={60}
                  />
                  {errors.email && touched.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>
                <View style={styles.textinputPassword}>
                  <TextInput
                    style={[
                      styles.textinput,
                      {
                        flex: 1,
                        borderWidth: 0,
                        borderColor: 'transparent',
                      },
                    ]}
                    placeholder="Enter your password"
                    placeholderTextColor={COLORS.placeholder}
                    secureTextEntry={secure}
                    value={values.password}
                    maxLength={15}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setSecure(!secure);
                    }}>
                    <Image
                      source={
                        secure
                          ? require('../assets/images/icons/eye-off.png')
                          : require('../assets/images/icons/eye.png')
                      }
                      style={{height: 20, width: 20, tintColor: COLORS.heading}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && touched.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
                <View style={styles.forgotView}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ForgotPassword');
                    }}>
                    <Text style={styles.forgotText}>Forgot Password ?</Text>
                  </TouchableOpacity>
                </View>
                <Button buttonTxt={'Login'} onPress={handleSubmit} />
              </View>
            )}
          </Formik>
          <View style={styles.registerLink}>
            <Text
              style={[
                styles.linkText,
                {color: COLORS.black, fontFamily: FONTS.Inter400},
              ]}>
              Don’t have an account?
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Register');
              }}>
              <Text style={styles.linkText}> Register Now</Text>
            </TouchableOpacity>
          </View>
          {loader && <ScreenLoader isProcessing={loader} />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 200,
  },
  container: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 22 : 15,
    marginTop: Platform.OS === 'ios' ? height * 0.16 : height * 0.1,
  },
  heading: {
    color: COLORS.heading,
    fontSize: fontScale * 30,
    textAlign: 'left',
    fontFamily: FONTS.Inter600,
    letterSpacing: 0.3,
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
  textinputBox: {
    paddingVertical: Platform.OS === 'ios' ? 15 : 10,
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
  forgotView: {
    paddingVertical: 20,
    alignItems: 'flex-end',
  },
  forgotText: {
    fontSize: fontScale * 14,
    color: COLORS.heading,
    fontFamily: FONTS.Inter400,
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
    fontSize: fontScale * 16,
    color: COLORS.white,
    fontFamily: FONTS.Inter500,
  },
});
