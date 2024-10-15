import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  PermissionsAndroid,
  KeyboardAvoidingView,
  ScrollView,
  I18nManager,
} from 'react-native';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import FONTS from '../theme/Fonts';
import {Dropdown} from 'react-native-element-dropdown';
import Button from '../components/Button';
import ImagePicker from 'react-native-image-crop-picker';
import {Formik} from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/native';
import Phone from '../components/Phone';
import {AuthContext} from '../restapi/AuthContext';
import axios from 'axios';
import {updateProfile} from '../restapi/ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenLoader from '../components/ScreenLoader';
import { useTranslation } from 'react-i18next';

const {height, width, fontScale} = Dimensions.get('screen');

const validationSchema = Yup.object().shape({
  name: Yup.string().min(3, 'Name is too short!').required('Name is required.'),
  email: Yup.string()
    .email('Invalid email address.')
    .required('Email address is required.')
    .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email.'),
  gender: Yup.string().required('Gender is required'),
  profilePic: Yup.string().required('Profile picture is required'),
  dob: Yup.string().required('Date of Birth is required'),
  phoneNumber: Yup.string()
    .required('Phone number is required.')
    .min(8, 'Phone number must be at least 8 characters.')
    .max(15, 'Phone number must be at most 15 characters.')
    .matches(/^\d+$/, 'Invalid phone number. Only digits are allowed.'),
});
const EditProfile = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const isRTL = I18nManager.isRTL;
  const {userData, getProfileData} = useContext(AuthContext);
  // console.log('🚀 ~ EditProfile ~ userData:', userData);
  const [value, setValue] = useState(userData?.gender || '');
  const [date, setDate] = useState(
    userData ? new Date(userData?.dob) : new Date(),
  );
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const data = [
    {label: t('Male'), value: '1',send:"Male"},
    {label: t('Female'), value: '2',send:"Female"},
    {label: t('Others'), value: '3',send:"Others"},
  ];
  const [countryCode, setCountryCode] = useState({
    callingCode: '966',
    cca2: '🇸🇦',
  });
  const onSelectImage = (type, setFieldValue) => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Alert.alert('Upload Image', 'Choose an option', [
        {
          text: 'Camera',
          onPress: () => {
            onCamera(setFieldValue);
          },
        },
        {
          text: 'Photo',
          onPress: () => {
            onGallary(setFieldValue);
          },
        },
        {text: 'Cancel', onPress: () => {}},
      ]);
    }
  };

  const onCamera = setFieldValue => {
    setTimeout(() => {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        quality: 'high',
      })
        .then(image => {
          // console.log("imagee",image)
          setFieldValue('profilePic', image.path);
        })
        .catch(error => {
          // console.log(error);
        });
    }, 1000);
  };

  const onGallary = setFieldValue => {
    setTimeout(() => {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        quality: 'high',
      })
        .then(image => {
          // console.log("imagee",image)
          setFieldValue('profilePic', image.path);
        })
        .catch(error => {
          // console.log(error);
        });
    }, 1000);
  };

  const ProfileUpdate = async values => {
    const token = await AsyncStorage.getItem('token');
    try {
      setLoader(true);

      // Create form data
      const formData = new FormData();
      formData.append('profileImage', {
        uri: values.profilePic, // Assuming profilePic is a valid local file path
        type: 'image/jpeg', // Adjust mime type according to the image type you receive
        name: 'profile.jpg', // Adjust the filename as needed
      });
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('mobile', values.phoneNumber);
      formData.append('gender', values.gender);
      formData.append('dob', values.dob);
      formData.append('phone_code', countryCode.callingCode);

      // Make API request
      const response = await axios({
        method: 'POST',
        url: updateProfile,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      });

      if (response?.data?.status === true) {
        setLoader(false);
        await getProfileData();
        showMessage({
          message: response?.data?.message,
          type: 'success',
        });
        navigation?.navigate('ProfileScreen');
      }
    } catch (error) {
      // console.log('error', error);
      setLoader(false);
    }
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.base} />
      <SafeAreaView style={styles.screen}>
        <Formik
          initialValues={{
            name: userData?.name ?? '',
            email: userData?.email ?? '',
            profilePic: userData?.profileImage ?? '',
            gender: userData?.gender ?? '',
            dob: userData?.dob ?? '',
            phoneNumber: userData?.mobile ?? '',
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            // console.log('Form values:', values);
            ProfileUpdate(values);
          }}>
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
          }) => (
            <KeyboardAvoidingView
              style={{flex: 1, backgroundColor: COLORS.white}}
              contentContainerStyle={{flexGrow: 1}}
              keyboardShouldPersistTaps="handled">
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                <Header
                  backicon={true}
                  headerText={t('Update Profile')}
                  backgroundColor={COLORS.base}
                  tintColor={COLORS.white}
                />
                <View style={styles.container}>
                  <View style={styles.profileContainer}>
                    <Image
                      source={
                        values?.profilePic
                          ? {uri: values?.profilePic}
                          : require('../assets/images/pictures/profile3.png')
                      }
                      style={{height: 100, width: 100, borderRadius: 100}}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={styles.edit}
                      onPress={() =>
                        onSelectImage('profilePic', setFieldValue)
                      }>
                      <Image
                        source={require('../assets/images/icons/edit.png')}
                        style={{height: 20, width: 20}}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.profilePic && touched.profilePic && (
                    <Text
                      style={[
                        styles.errorText,
                        {marginTop: Platform.OS === 'ios' ? 10 : 5},
                      ]}>
                      {errors.profilePic}
                    </Text>
                  )}
                </View>
                <View style={styles.formContainer}>
                  <TextInput
                    style={styles.textinput}
                    placeholder="Name"
                    placeholderTextColor={COLORS.placeholder}
                    maxLength={60}
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                  />
                  {errors.name && touched.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}
                  <TextInput
                    style={styles.textinput}
                    placeholder="Email"
                    placeholderTextColor={COLORS.placeholder}
                    maxLength={60}
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                  />
                  {errors.email && touched.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                  <View style={{marginTop: 10}}>
                    <Phone
                      handleBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                      handleChange={handleChange}
                      values={values.phoneNumber}
                      setCountryCode={setCountryCode}
                      countryCode={countryCode}
                      phone_code={userData?.phone_code}
                    />
                  </View>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    containerStyle={styles.dropdowncontainer}
                    itemContainerStyle={{paddingHorizontal: 10}}
                    iconStyle={styles.iconStyle}
                    data={data}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={
                      userData?.gender
                        ? userData.gender.charAt(0).toUpperCase() +
                          userData.gender.slice(1)
                        : t('Gender')
                    }
                    value={value}
                    onChange={item => {
                      // console.log("slected",item)
                      setFieldValue('gender', item.send);
                      setValue(item.send);
                    }}
                  />
                  {errors.gender && touched.gender && (
                    <Text style={styles.errorText}>{errors.gender}</Text>
                  )}
                  <View style={styles.textinputPassword}>
                    <TextInput
                      style={[
                        styles.textinput,
                        {
                          flex: 1,
                          borderWidth: 0,
                          borderColor: 'transparent',
                          color: COLORS.base,
                          paddingVertical:
                            Platform.OS === 'ios'
                              ? height * 0.016
                              : height * 0.008,
                        },
                      ]}
                      placeholder="DOB"
                      editable={false}
                      value={date ? moment(date).format('YYYY-MM-DD') : ''}
                      placeholderTextColor={COLORS.placeholder}
                    />
                    <TouchableOpacity onPress={() => setOpen(true)}>
                      <Image
                        source={require('../assets/images/icons/calender.png')}
                        style={{height: 22, width: 22}}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    <DatePicker
                      modal
                      mode="date"
                      open={open}
                      date={userData ? new Date(userData?.dob) : date}
                      onConfirm={date => {
                        setOpen(false);
                        setDate(date);
                        setFieldValue('dob', moment(date).format('YYYY-MM-DD'));
                        setFieldTouched('dob', true); // Mark dob field as touched
                      }}
                      onCancel={() => {
                        setOpen(false);
                      }}
                    />
                  </View>
                  {touched.dob && errors.dob && (
                    <Text style={styles.errorText}>{errors.dob}</Text>
                  )}
                </View>
                <View style={styles.bottomContainer}>
                  <Button buttonTxt={t('Update Profile')} onPress={handleSubmit} />
                </View>
                {loader && <ScreenLoader isProcessing={loader} />}
              </ScrollView>
            </KeyboardAvoidingView>
          )}
        </Formik>
      </SafeAreaView>
    </>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.base,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  container: {
    backgroundColor: COLORS.base,
    paddingVertical: Platform.OS === 'ios' ? height * 0.03 : height * 0.04,
    alignItems: 'center',
  },
  profileContainer: {
    position: 'relative',
    alignItems: 'center',
    borderColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 100,
  },
  formContainer: {
    paddingHorizontal: height * 0.025,
    paddingVertical: height * 0.02,
    backgroundColor: '#F7F7F7',
    flex: 1,
  },
  bottomContainer: {
    paddingHorizontal: height * 0.025,
    paddingBottom: height * 0.02,
    backgroundColor: '#F7F7F7',
    paddingBottom: 20,
  },
  textinput: {
    backgroundColor: COLORS.white,
    paddingVertical: Platform.OS === 'ios' ? height * 0.02 : height * 0.014,
    borderRadius: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    fontSize: fontScale * 16,
    fontFamily: FONTS.Inter400,
    color: COLORS.black,
    marginTop: height * 0.01,
  },
  dropdown: {
    height: Platform.OS === 'ios' ? 60 : 50,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginTop: height * 0.01,
    backgroundColor: COLORS.white,
  },
  placeholderStyle: {
    fontSize: fontScale * 17,
    // fontFamily: FONTS.Inter400,
    color: COLORS.base,
  },
  selectedTextStyle: {
    fontSize: fontScale * 17,
    // fontFamily: FONTS.Inter400,
    color: COLORS.base,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  dropdowncontainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: COLORS.borderColor,
  },
  textinputPassword: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    paddingRight: 10,
    marginTop: height * 0.01,
  },
  edit: {
    position: 'absolute',
    backgroundColor: COLORS.primary,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 30,
    bottom: 0,
    right: -8,
  },
  errorText: {
    fontSize: fontScale * 12,
    fontFamily: FONTS.Inter500,
    color: COLORS.red,
    paddingLeft: 5,
    marginTop: Platform.OS === 'ios' ? 5 : 2,
  },
});
