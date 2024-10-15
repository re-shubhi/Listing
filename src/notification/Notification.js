import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  I18nManager,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import ScreenWithBackground from '../components/ScreenWithBackground';
import axios from 'axios';
import {getNotification, notificationDelete} from '../restapi/ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {AuthContext} from '../restapi/AuthContext';
import moment from 'moment';
import ScreenLoader from '../components/ScreenLoader';
import Button from '../components/Button';
import {showMessage} from 'react-native-flash-message';
import {useTranslation} from 'react-i18next';
import { translateText } from '../../services/translationService';

const {height, width, fontScale} = Dimensions.get('screen');

const Notification = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const isRTL = I18nManager.isRTL;
  const isfocus = useIsFocused();
  const [notification, setNotification] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const {userData} = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [delId, seDelId] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
  };

  const DeleteNotification = async idToDelete => {
    // console.log('🚀 ~ DeleteNotification ~ idToDelete:', idToDelete);
    const token = await AsyncStorage.getItem('token');
    const lang = await AsyncStorage.getItem('languageSelected') || 'en';
    // console.log("🚀 ~ DeleteNotification ~ token:", token)
    try {
      const res = await axios({
        url: notificationDelete,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          id: idToDelete,
        },
      });
      if (res?.data?.status === true) {
        const translatedDate = await translateText(res?.data?.message, lang);
        setModalVisible(false);
        showMessage({
          message: translatedDate,
          type: 'success',
          style:{alignItems:'flex-start'}
        });
        await NotidyData();
      }
    } catch (error) {
      // console.log('error', error?.response?.data);
    }
  };

  const NotidyData = async () => {
    const token = await AsyncStorage.getItem('token');
    const lang = await AsyncStorage.getItem('languageSelected') || 'en';
    try {
      setLoader(true);
      const response = await axios({
        method: 'POST',
        url: getNotification,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data?.status === true) {
        // setNotification(response?.data?.data?.reverse());
        const translatedNotifications = await Promise.all(response?.data?.data.map(async (item) => {
          const translatedTitle = await translateText(item.message, lang); 
          const translatedDate = await translateText(item.created_at, lang); 
          return {
            ...item,
            message: translatedTitle,
            created_at:translatedDate,
          };
        }));
        setNotification(translatedNotifications.reverse());
        // console.log('response Notification---', response?.data?.data.reverse());
        setLoader(false);
      }
    } catch (error) {
      console.log('error--', error?.response?.data);
      setLoader(false);
    }
  };

  useEffect(() => {
    NotidyData();
  }, [isfocus]);

  return (
    <ScreenWithBackground>
      <SafeAreaView style={styles.screen}>
        <Header
          backicon={true}
          headerText={t('notification')}
          backgroundColor={COLORS.base}
          tintColor={COLORS.white}
        />
        <View style={styles.RemainingScreen}>
          <FlatList
            data={notification}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 60}}
            // inverted
            renderItem={({item}) => {
              return (
                <>
                  <View
                    style={[
                      styles.container
                    ]}>
                    <View
                      style={[
                        styles.bell,
                        {alignSelf: isRTL ? 'flex-start' : 'flex-end'},
                      ]}>
                      <Image
                        source={require('../assets/images/icons/notify.png')}
                        style={{
                          height: 25,
                          width: 25,
                          borderRadius: 10,
                          tintColor: COLORS.white,
                        }}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={{flex: 1,alignItems: isRTL ? 'flex-start' : 'flex-start'}}>
                      <Text
                        style={{
                          ...styles.nameText,
                          fontFamily: FONTS.Inter400,
                          textAlign: isRTL ? 'right' : 'left',
                        }}>
                        {item.message}
                      </Text>
                      <Text
                        style={{
                          ...styles.nameText,
                          fontSize: fontScale * 12,
                          fontFamily: FONTS.Inter400,
                          lineHeight: 17,
                          textAlign: isRTL ? 'right' : 'left',
                        }}>
                        {item?.created_at}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(true);
                        seDelId(item?.id);
                      }}>
                      <Image
                        source={require('../assets/images/icons/threedot.png')}
                        style={{height: 20, width: 20}}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                </>
              );
            }}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    justifyContent: 'center',
                    height: height * 0.7,
                    backgroundColor: COLORS.white,
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: fontScale * 16, color: COLORS.black}}>
                    {t('No data found')}
                  </Text>
                </View>
              );
            }}
          />
          <Modal visible={modalVisible} onRequestClose={closeModal} transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Image
                  source={require('../assets/images/icons/bin.png')}
                  style={{height: 25, width: 25, tintColor: COLORS.base}}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    marginTop: 14,
                    fontSize: fontScale * 16,
                    width: width * 0.5,
                    textAlign: 'center',
                    lineHeight: 24,
                  }}>
                  {t('Do you want to delete this notification?')}
                </Text>
                <View style={styles.logoutBox}>
                  <Button
                    buttonTxt={t('Cancel')}
                    onPress={closeModal}
                    width={width * 0.28}
                  />
                  <Button
                    buttonTxt={t('Yes')}
                    onPress={() => DeleteNotification(delId)}
                    width={width * 0.28}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
        {loader && <ScreenLoader isProcessing={loader} />}
      </SafeAreaView>
    </ScreenWithBackground>
  );
};

export default Notification;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  RemainingScreen: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.01,
    marginTop: height * 0.02,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginHorizontal: width * 0.02,
  },
  nameText: {
    fontSize: fontScale * 14,
    fontFamily: FONTS.Inter600,
    color: COLORS.black,
    lineHeight: 18,
  },
  content: {
    fontSize: fontScale * 14,
    color: COLORS.base,
    fontFamily: FONTS.Inter400,
    lineHeight: 18,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 10,
    paddingVertical: height * 0.01,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: height * 0.22,
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
  bell: {
    backgroundColor: COLORS.base,
    borderRadius: 100,
    alignItems: 'center',
    alignSelf: 'center',
    height: 45,
    width: 45,
    marginTop: 10,
    justifyContent: 'center',
  },
});
