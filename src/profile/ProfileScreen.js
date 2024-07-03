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
import React, {useContext, useEffect, useState} from 'react';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import {CommonActions, useNavigation} from '@react-navigation/native';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../restapi/AuthContext';

const {height, width, fontScale} = Dimensions.get('screen');

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const {userData, setUserData, getProfileData} = useContext(AuthContext);
  console.log('SCREEN USERdATA===', userData);
  const closeModal = () => {
    setModalVisible(false);
  };
  const logout = async () => {
    setTimeout(() => {
      AsyncStorage.removeItem('token');
      setUserData(null);
      setModalVisible(false),
        navigation?.dispatch(
          CommonActions?.reset({
            index: 0,
            routes: [{name: 'Login'}],
          }),
        );
    }, 500);
  };

  useEffect(() => {
    getProfileData();
  }, [navigation]);
  return (
    <>
      <SafeAreaView style={styles.screen}>
        <StatusBar backgroundColor={COLORS.base} barStyle={'dark-content'} />
        <Header
          backicon={true}
          headerText={'Profile'}
          backgroundColor={COLORS.base}
          tintColor={COLORS.white}
        />
        <View style={styles.container}>
          <Image
            source={
              userData?.profileImage
                ? {uri: userData?.profileImage}
                : require('../assets/images/pictures/profile.png')
            }
            style={{height: 100, width: 100, borderRadius: 100}}
            resizeMode="cover"
          />
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
              <Text style={styles.iconText}>Wishlist</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.IconButton}
              onPress={() => navigation.navigate('EditProfile')}>
              <Image
                source={require('../assets/images/icons/edit.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.iconText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.ContainerBox, styles.boxWithShadow]}>
            <View style={styles.box}>
              <Text style={styles.Heading}>Basic Details</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.Heading}>Name</Text>
              <Text style={styles.subText}>{userData?.name}</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.Heading}>Email</Text>
              <Text style={styles.subText}>{userData?.email}</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.Heading}>Gander</Text>
              <Text style={styles.subText}>{userData?.gender}</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.Heading}>DOB</Text>
              <Text style={styles.subText}>{userData?.dob}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.logout}
            onPress={() => setModalVisible(true)}>
            <Image
              source={require('../assets/images/icons/exit.png')}
              style={{height: 20, width: 20, tintColor: COLORS.base}}
              resizeMode="contain"
            />
            <Text style={styles.iconText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={modalVisible} onRequestClose={closeModal} transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image
                source={require('../assets/images/icons/exit.png')}
                style={{height: 25, width: 25, tintColor: COLORS.base}}
                resizeMode="contain"
              />
              <Text style={[styles.iconText, {marginTop: 20}]}>
                Are you sure you want to Logout?
              </Text>
              <View style={styles.logoutBox}>
                <Button
                  buttonTxt={'Yes'}
                  onPress={logout}
                  width={width * 0.28}
                />
                <Button
                  buttonTxt={'No'}
                  onPress={closeModal}
                  width={width * 0.28}
                />
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

export default ProfileScreen;

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
    paddingTop: 30,
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
