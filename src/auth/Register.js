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
import { showMessage } from 'react-native-flash-message';

const {height, width, fontScale} = Dimensions.get('screen');

const Register = () => {
  const navigation = useNavigation();

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required')
      .matches(/^[a-zA-Z][a-zA-Z0-9_-]{2,15}$/, 'Invalid username'),
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required')
      .matches(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Invalid email',
      ),
    password: Yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        'Password must contain minimum 8 characters including atleast 1 uppercase letter, 1 lowercase letter and 1 special character.',
      ),
    confirmPassword: Yup.string()
      .required('Confirmation of your password is required.')
      .oneOf(
        [Yup.ref('password'), null],
        'Confirm Password should match with New Password.',
      ),
  });

  const [secure, setSecure] = useState({password: true, confirmPassword: true});

  const toggleSecure = field => {
    setSecure(prevSecure => ({...prevSecure, [field]: !prevSecure[field]}));
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
            initialValues={{
              email: '',
              password: '',
              username: '',
              confirmPassword: '',
            }}
            validationSchema={validationSchema}
            onSubmit={() => {
              showMessage({
                message:'Registration successfull',
                type:'success'
              })
              navigation.dispatch(
                CommonActions.reset({
                  index:0,
                  routes:[{name:"Login"}]
                })
              )
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
                    Hello! Register to get started
                  </Text>
                </View>
                <View style={{marginVertical: 10}}>
                  <TextInput
                    style={styles.textinput}
                    placeholder="Username"
                    placeholderTextColor={COLORS.placeholder}
                    value={values.username}
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    maxLength={60}
                  />
                  {errors.username && touched.username && (
                    <Text style={styles.errorText}>{errors.username}</Text>
                  )}
                </View>
                <View style={{marginBottom: 10}}>
                  <TextInput
                    style={styles.textinput}
                    placeholder="Email"
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
                    placeholder="Password"
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
                      style={{height: 20, width: 20,tintColor:COLORS.heading}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && touched.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
                <View style={[styles.textinputPassword, {marginTop: 10}]}>
                  <TextInput
                    style={[
                      styles.textinput,
                      {
                        flex: 1,
                        borderWidth: 0,
                        borderColor: 'transparent',
                      },
                    ]}
                    placeholder="Confirm Password"
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
                      style={{height: 20, width: 20,tintColor:COLORS.heading}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && touched.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
                <View style={{marginTop: 15}}>
                  <Button buttonTxt={'Register'} onPress={handleSubmit} />
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
              Already have an account ?
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
              }}>
              <Text style={styles.linkText}> Login Now</Text>
            </TouchableOpacity>
          </View>
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
    bottom: Platform.OS === 'ios' ? 30 : 42,
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
