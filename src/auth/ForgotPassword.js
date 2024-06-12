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
import React, {useState} from 'react';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import {useNavigation} from '@react-navigation/native';
import Button from '../components/Button';
import {Formik} from 'formik';
import * as Yup from 'yup';

const {height, width, fontScale} = Dimensions.get('screen');

const ForgotPassword = () => {
  const navigation = useNavigation();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required')
      .matches(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Invalid email',
      )
  });

  return (
    <SafeAreaView style={styles.screen}>
      <Header backicon/>
      <Formik
        initialValues={{email: ''}}
        validationSchema={validationSchema}
        onSubmit={() => {
          navigation?.navigate('OtpScreen');
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
              <Text style={styles.heading}>Reset your password</Text>
              <Text style={styles.subheading}>
                Enter your email for the varification proccess will we send 4
                digit code your email
              </Text>
            </View>
            <View style={styles.textinputBox}>
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
            <View style={{marginTop:10}}>
            <Button buttonTxt={'Continue'} onPress={handleSubmit} />
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
  heading: {
    color: COLORS.heading,
    fontSize:fontScale* 30,
    textAlign: 'left',
    fontFamily: FONTS.Inter600,
    letterSpacing: 0.3,
  },
  TextContainer: {
    marginRight: width * 0.12,
    marginBottom: 10,
  },
  subheading: {
    fontSize: fontScale*14,
    fontFamily: FONTS.Inter400,
    color: COLORS.heading,
    letterSpacing: 0.3,
    paddingTop:5
  },
  textinput: {
    backgroundColor: COLORS.white,
    paddingVertical: 20,
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
});
