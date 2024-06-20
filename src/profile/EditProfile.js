import React, {useState} from 'react';
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
});
const EditProfile = () => {
  const [value, setValue] = useState(null);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

const data = [
  {label: 'Male', value: '1'},
  {label: 'Female', value: '2'},
  {label: 'Others', value: '3'},
];

  const onSelectImage = (type, setFieldValue) => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Alert.alert('Upload Image', 'Choose an option', [
        {
          text: 'Camera',
          onPress: () => {
            onCamera(type, setFieldValue);
          },
        },
        {
          text: 'Photo',
          onPress: () => {
            onGallary(type, setFieldValue);
          },
        },
        {text: 'Cancel', onPress: () => {}},
      ]);
    }
  };
  
  const onCamera = (type, setFieldValue) => {
    setTimeout(() => {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        quality: 'high',
        // includeBase64: true,
      }).then(image => {
        setFieldValue('profilePic', image.path);
      });
    }, 1000);
  };

  const onGallary = (type, setFieldValue) => {
    setTimeout(() => {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        quality: 'high',
      }).then(image => {
        setFieldValue('profilePic', image.path);
      });
    }, 1000);
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.base} />
      <SafeAreaView style={styles.screen}>
        <Formik
          initialValues={{
            name: '',
            email: '',
            profilePic: '',
            gender: '',
            dob: '',
          }}
          validationSchema={validationSchema}
          onSubmit={values => console.log('Form values:', values)}
        >
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
            <KeyboardAvoidingScrollView
              style={{flex: 1, backgroundColor: COLORS.white}}
              contentContainerStyle={{flexGrow: 1}}
              keyboardShouldPersistTaps="handled"
            >
              <Header
                backicon={true}
                headerText={'Update Profile'}
                backgroundColor={COLORS.base}
                tintColor={COLORS.white}
              />

              <View style={styles.container}>
                <Image
                  source={
                    values?.profilePic
                      ? {uri: values?.profilePic}
                      : require('../assets/images/pictures/profile.png')
                  }
                  style={{height: 100, width: 100, borderRadius: 100}}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={[
                    styles.edit,
                    {
                      bottom: errors.profilePic ? 50 : 20,
                      right: errors.profilePic ? 165 : 160,
                    },
                  ]}
                  onPress={() => onSelectImage('profilePic', setFieldValue)}
                >
                  <Image
                    source={require('../assets/images/icons/edit.png')}
                    style={{height: 20, width: 20}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                {errors.profilePic && touched.profilePic && (
                  <Text style={[styles.errorText, {marginTop: 10}]}>
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
                  placeholder="Gender"
                  value={value}
                  onChange={item => {
                    setFieldValue('gender', item.label);
                    setValue(item.label);
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
                        paddingVertical:
                          Platform.OS === 'ios'
                            ? height * 0.016
                            : height * 0.014,
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
                    mode='date'
                    open={open}
                    date={date}
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
                {touched.dob && errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
              </View>
              <View style={styles.bottomContainer}>
                <Button buttonTxt={'Update Profile'} onPress={handleSubmit} />
              </View>
            </KeyboardAvoidingScrollView>
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
  container: {
    backgroundColor: COLORS.base,
    paddingVertical: Platform.OS === 'ios' ? height * 0.03 : height * 0.04,
    alignItems: 'center',
    position: 'relative',
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
    justifyContent: 'flex-end',
    flex: 1,
  },
  textinput: {
    backgroundColor: COLORS.white,
    paddingVertical: Platform.OS === 'ios' ? height * 0.02 : height * 0.014,
    borderRadius: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    fontSize: fontScale * 17,
    fontFamily: FONTS.Inter400,
    color: COLORS.black,
    marginTop: height * 0.01,
  },
  dropdown: {
    height: 60,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginTop: height * 0.01,
  },
  placeholderStyle: {
    fontSize: fontScale * 17,
    fontFamily: FONTS.Inter400,
    color: COLORS.black,
  },
  selectedTextStyle: {
    fontSize: fontScale * 17,
    fontFamily: FONTS.Inter400,
    color: COLORS.black,
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
    bottom: 24,
    right: 160,
  },
  errorText: {
    fontSize: fontScale * 12,
    fontFamily: FONTS.Inter500,
    color: COLORS.red,
    paddingLeft: 5,
    marginTop: Platform.OS === 'ios' ? 5 : 2,
  },
});
