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

const Login = () => {
  const navigation = useNavigation();

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
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        'Password must contain minimum 8 characters including atleast 1 uppercase letter, 1 lowercase letter and 1 special character.',
      ),
  });

  const [secure, setSecure] = useState('');
  return (
    <SafeAreaView style={styles.screen}>
      <Header  backicon/>
      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={validationSchema}
        onSubmit={() => {
          navigation?.navigate('BottomTabNavigation');
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
                  style={{height: 24, width: 24}}
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
        <Text style={[styles.linkText, {color: COLORS.black,fontFamily:FONTS.Inter400}]}>
          Don’t have an account?
        </Text>
        <TouchableOpacity onPress={()=>{
          navigation.navigate("Register")
        }}>
          <Text style={styles.linkText}> Regsiter Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: COLORS.primary},
  container: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 22,
    marginTop: height * 0.16,
  },
  heading: {
    color: COLORS.heading,
    fontSize:fontScale* 30,
    textAlign: 'left',
    fontFamily: FONTS.Inter600,
    letterSpacing: 0.3,
  },
  TextContainer: {
    marginRight: width * 0.14,
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
  textinputBox: {
    paddingVertical: 15,
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
    fontSize: fontScale * 16,
    color: COLORS.heading,
    fontFamily: FONTS.Inter400,
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
