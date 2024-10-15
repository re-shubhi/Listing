import React, { useContext, useState, useEffect } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import { CommonActions, useIsFocused, useNavigation } from '@react-navigation/native';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../services/i18n';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import Button from '../components/Button';
import { AuthContext } from '../restapi/AuthContext';
import { useTranslation } from 'react-i18next';
import RNRestart from 'react-native-restart';
import { translateText } from '../../services/translationService'; 

const { height, width, fontScale } = Dimensions.get('screen');

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const isfocus = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
// Initialize userData state
  const { userData, setUserData, getProfileData } = useContext(AuthContext);

  const closeModal = () => {
    setModalVisible(false);
  };

  const logout = async () => {
    setTimeout(() => {
      AsyncStorage.removeItem('token');
      setModalVisible(false);
      navigation?.dispatch(
        CommonActions?.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        }),
      );
    }, 500);
  };

  const changeLanguage = async (lang) => {
    setLanguageModalVisible(false);
    // Update the language in i18n
    i18n.changeLanguage(lang);

    // Determine if the language is RTL
    const isRTL = lang === 'ar';

    // Check if RTL setting needs to be updated
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
      RNRestart.restart();
    }

    // Save the selected language to AsyncStorage
    await AsyncStorage.setItem('languageSelected', lang);

    // Fetch translated texts dynamically if needed
    await fetchAndTranslateUserData();
  };

  const fetchAndTranslateUserData = async () => {
    const lang = await AsyncStorage.getItem('languageSelected') || 'en';
    if (userData) {
      setUserData({
        ...userData,
        name: await translateText(userData.name, lang),
        email: await translateText(userData.email, lang),
        gender: await translateText(userData.gender, lang),
        dob: await translateText(userData.dob, lang),
      });
    }
  };

  useEffect(() => {
    getProfileData();
  }, [isfocus]);

  useEffect(() => {
    fetchAndTranslateUserData();
  }, [userData]);

  return (
    <>
      <SafeAreaView style={styles.screen}>
        <StatusBar backgroundColor={COLORS.base} barStyle={'dark-content'} />
        <Header
          backicon={true}
          headerText={t('Profile')}
          backgroundColor={COLORS.base}
          tintColor={COLORS.white}
        />
        <View style={styles.container}>
          <View style={{ borderRadius: 100, borderWidth: 1, borderColor: COLORS?.white }}>
            <Image
              source={
                userData?.profileImage
                  ? { uri: userData?.profileImage }
                  : require('../assets/images/pictures/profile3.png')
              }
              style={{ height: 100, width: 100, borderRadius: 100 }}
              resizeMode="cover"
            />
          </View>
          <View>
            <Text style={styles.name}>{userData?.name}</Text>
            <Text
              style={{
                ...styles.name,
                fontSize: fontScale * 14,
                lineHeight: 20,
              }}>
              {userData?.email}
            </Text>
          </View>
        </View>
        <View style={styles.RemainingScreen}>
          <View style={[styles.OptionContainer, styles.boxWithShadow]}>
            <TouchableOpacity
              style={styles.IconButton}
              onPress={() => navigation.navigate('Wishlist')}>
              <Image
                source={require('../assets/images/icons/heart.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.iconText}>{t('wishlist')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.IconButton}
              onPress={() => navigation.navigate('EditProfile')}>
              <Image
                source={require('../assets/images/icons/edit.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.iconText}>{t('Edit')}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.ContainerBox, styles.boxWithShadow]}>
            <View style={styles.box}>
              <Text style={styles.Heading}>{t('Basic Details')}</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.Heading}>{t('Name')}</Text>
              <Text style={styles.subText}>{userData?.name}</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.Heading}>{t('email')}</Text>
              <Text style={styles.subText}>{userData?.email}</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.Heading}>{t('Gender')}</Text>
              <Text style={styles.subText}>{userData?.gender}</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.Heading}>{t('DOB')}</Text>
              <Text style={styles.subText}>{userData?.dob}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.logout}
            onPress={() => setLanguageModalVisible(true)}>
            <Image
              source={require('../assets/images/icons/feedback.png')}
              style={{ height: 22, width: 22, tintColor: COLORS.base }}
              resizeMode="contain"
            />
            <Text style={styles.iconText}>{t('Change Language')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logout}
            onPress={() => setModalVisible(true)}>
            <Image
              source={require('../assets/images/icons/exit.png')}
              style={{ height: 20, width: 20, tintColor: COLORS.base }}
              resizeMode="contain"
            />
            <Text style={styles.iconText}>{t('Logout')}</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={modalVisible} onRequestClose={closeModal} transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image
                source={require('../assets/images/icons/exit.png')}
                style={{ height: 25, width: 25, tintColor: COLORS.base }}
                resizeMode="contain"
              />
              <Text style={[styles.iconText, { marginTop: 20 }]}>
                {t('Are you sure you want to Logout?')}
              </Text>
              <View style={styles.logoutBox}>
                <Button
                  buttonTxt={t('Yes')}
                  onPress={logout}
                  width={width * 0.28}
                />
                <Button
                  buttonTxt={t('No')}
                  onPress={closeModal}
                  width={width * 0.28}
                />
              </View>
            </View>
          </View>
        </Modal>
        <Modal visible={languageModalVisible} onRequestClose={() => setLanguageModalVisible(false)} transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.Heading}>{t('Select Language')}</Text>
              <View style={{ alignItems: "center", rowGap: 5, marginTop: 10 }}>
                <TouchableOpacity onPress={() => changeLanguage('en')}>
                  <Text style={[styles.iconText, { color: COLORS.black, fontFamily: FONTS.Inter800 }]}>{t('English')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeLanguage('ar')}>
                  <Text style={[styles.iconText, { color: COLORS.black, fontFamily: FONTS.Inter800 }]}> (Arabic) عربي </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.base,
  },
  name: {
    color: COLORS.white,
    fontSize: fontScale * 18,
    fontFamily: FONTS.Inter500,
    lineHeight: 24.2,
  },
  container: {
    backgroundColor: COLORS.base,
    paddingVertical: Platform.OS === 'ios' ? height * 0.03 : height * 0.04,
    paddingHorizontal: width * 0.05,
    flexDirection: 'row',
    columnGap: 20,
    alignItems: 'center',
  },
  RemainingScreen: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.01,
  },
  OptionContainer: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.08,
    borderRadius: 10,
  },
  boxWithShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 2,
  },
  icon: {
    height: 22,
    width: 22,
  },
  IconButton: {
    alignItems: 'center',
    paddingVertical: height * 0.01,
    rowGap: 10,
  },
  iconText: {
    fontSize: fontScale * 15,
    fontFamily: FONTS.Inter400,
    lineHeight: 21,
    color: COLORS.base,
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingVertical: height * 0.005,
  },
  ContainerBox: {
    backgroundColor: COLORS.white,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    borderRadius: 10,
    marginVertical: height * 0.02,
  },
  Heading: {
    fontSize: fontScale * 16,
    fontFamily: FONTS.Inter400,
    lineHeight: 21,
    color: COLORS.base,
  },
  subText: {
    fontSize: fontScale * 14,
    fontFamily: FONTS.Inter500,
    lineHeight: 19,
    color: COLORS.base,
  },
  logout: {
    paddingTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 15,
    paddingLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: height * 0.3,
    width: '80%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    columnGap: 20,
  },
});


export default ProfileScreen;
