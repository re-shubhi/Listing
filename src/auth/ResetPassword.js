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

const ResetPassword = () => {
  const navigation = useNavigation();

  const validationSchema = Yup.object().shape({
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
      <Header />
      <Formik
        initialValues={{
          password: '',
          confirmPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={() => {
          navigation?.navigate('Login');
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
              <Text style={styles.heading}>Reset password</Text>
              <Text style={styles.subheading}>
                Set the new password for your account so you can login and
                access all the features.
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
                  },
                ]}
                placeholder="Password"
                placeholderTextColor={COLORS.placeholder}
                secureTextEntry={secure}
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
                  style={{height: 24, width: 24}}
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
                secureTextEntry={secure}
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
                  style={{height: 24, width: 24}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && touched.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
            <View style={{marginTop: 15}}>
              <Button buttonTxt={'Reset Password'} onPress={handleSubmit} />
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

export default ResetPassword;

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
  heading: {
    color: COLORS.heading,
    fontSize: fontScale * 30,
    textAlign: 'left',
    fontFamily: FONTS.Inter600,
    letterSpacing: 0.3,
  },
  TextContainer: {
    marginRight: width * 0.15,
    marginBottom: 10,
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
  subheading: {
    fontSize: fontScale * 14,
    fontFamily: FONTS.Inter400,
    color: COLORS.heading,
    letterSpacing: 0.3,
    paddingTop: 5,
  },
});
