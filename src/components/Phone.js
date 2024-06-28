import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CountryPicker} from 'react-native-country-codes-picker';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import * as Yup from 'yup';

const {height, width, fontScale} = Dimensions.get('screen');
const PhoneSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .trim()
    .matches(/^\+[1-9]{1}[0-9]{3,14}$/, 'Please enter valid phone number')
    .required('Phone number is required')
    .max(13, 'Invalid phone number'),
});

const Phone = ({
  handleChange,
  values,
  touched,
  errors,
  width,
  handleBlur,
  userData,
  setCountryCode,
  countryCode,
}) => {
  const [country, setCountry] = useState(null);
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  //to hnadle change in country code
  const handleCountryChange = selectedCountry => {
    // console.log("dddsgsg", selectedCountry);
    setCountry(selectedCountry);
    setCountryCode({
      callingCode: selectedCountry?.dial_code,
      cca2: selectedCountry?.flag,
    });
    setIsPickerVisible(false);
  };
  //to toggle the picker
  const togglePicker = () => {
    setIsPickerVisible(!isPickerVisible);
  };
  //To set default code
  useEffect(() => {
    setCountry({cca2: 'LB', name: 'Saudi Arabia', callingCode: ['966']});
  }, []);
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View
          style={[
            styles.inputContainer,{
              width: {width},
            }
          ]}>
          <CountryPicker
            placeholderTextColor={'grey'}
            show={isPickerVisible}
            lang={'en'}
            style={{
              modal: {
                height: Platform.OS == 'android' ? 400 : 600,
                backgroundColor: '#fff',
              },
              // Styles for modal backdrop [View]
              backdrop: {backgroundColor: 'rgba(0,0,0,0.5)'},

              line: {
                // backgroundColor:"#092147"
              },
              // Styles for list of countries [FlatList]
              itemsList: {},
              // Styles for input [TextInput]
              textInput: {
                backgroundColor: '#fff',
                // shadowColor: Colors.isDarkMode ? 'rgba(0,0,0,1)' : COLORS.shadowColor,
                shadowRadius: 5,
                // shadowOffset: {
                //   height: 0.5,
                //   width: 0.5
                // },
                // shadowOpacity: 0.5,
                elevation: 2,
                paddingHorizontal: 16,
                color: '#000',
              },
              // Styles for country button [TouchableOpacity]
              countryButtonStyles: {
                height: 50,
                backgroundColor: '#f7f7f7',
                // shadowColor: Colors.isDarkMode ? 'rgba(0,0,0,1)' : COLORS.shadowColor,
                // shadowRadius: 5,
                // shadowOffset: {
                //   height: 0.5,
                //   width: 0.5
                // },
                // shadowOpacity: 0.5,
                // elevation: 5
              },
              // Styles for search message [Text]
              searchMessageText: {
                color: '#000',
              },
              // Styles for search message container [View]
              countryMessageContainer: {
                color: 'red',
              },
              // Flag styles [Text]
              flag: {fontSize: 14, color: 'black'},
              // Dial code styles [Text]
              dialCode: {
                fontFamily: 'Karla-Regular',
                fontSize: 14,
                color: '#000',
              },
              // Country name styles [Text]
              countryName: {
                fontFamily: 'Karla-Regular',
                fontSize: 14,
                color: '#000',
              },
              inputSearchStyle: {
                color: 'red',
              },
            }}
            onBackdropPress={() => {
              setIsPickerVisible(false);
            }}
            pickerButtonOnPress={item => {
              handleCountryChange(item);
              setIsPickerVisible(false);
            }}
          />
          <TouchableOpacity onPress={togglePicker}>
            <Text style={styles.countryCodeText}>
              {countryCode?.cca2} {`${countryCode?.callingCode}`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePicker}>
            <Image
              source={require('../assets/images/icons/down-arrow.png')}
              style={{height: 15, width: 15}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={styles.verticalLine} />
          <TextInput
            style={styles.textinput}
            placeholder="Phone number"
            value={values}
            onChangeText={handleChange('phoneNumber')}
            onBlur={handleBlur('phoneNumber')}
            keyboardType="phone-pad"
            placeholderTextColor={'#757575'}
            maxLength={17}
          />
        </View>
        {touched.phoneNumber && errors.phoneNumber && (
            <Text style={styles.validation}>{errors.phoneNumber}</Text>
          )}
      </View>
    </SafeAreaView>
  );
};

export default Phone;

const styles = StyleSheet.create({
  container: {
    // marginVertical: 7,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
    height: height * 0.065,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  countryCodeText: {
    fontSize: fontScale*15,
    color: COLORS.black,
  },
  verticalLine: {
    height: 26,
    borderRightWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.25)',
    marginRight:0,
    marginLeft:5
  },
  textinput: {
    backgroundColor: COLORS.white,
    paddingVertical: Platform.OS === 'ios' ? 20 : height * 0.014,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: fontScale * 16,
    fontFamily: FONTS.Inter400,
    color: COLORS.black,
    flex: 1,
  },
  validation: {
    fontSize: fontScale * 12,
    fontFamily: FONTS.Inter500,
    color: COLORS.red,
    paddingLeft: 5,
    marginTop: 5,
  },
});
