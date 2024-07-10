import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import NotificationData from './NotificationData';
import ScreenWithBackground from '../components/ScreenWithBackground';
import axios from 'axios';
import {getNotification} from '../restapi/ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../restapi/AuthContext';
import moment from 'moment';
import ScreenLoader from '../components/ScreenLoader';

const {height, width, fontScale} = Dimensions.get('screen');

const Notification = () => {
  const navigation = useNavigation();
  const [notification, setNotification] = useState([]);
  const {userData} = useContext(AuthContext);
  const [loader, setLoader] = useState(false);

  const NotidyData = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      setLoader(true)
      const response = await axios({
        method: 'POST',
        url: getNotification,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log('response Notification---', response?.data);
      if (response?.data?.status === true) {
        setNotification(response?.data?.data);
        setLoader(false)
      }
    } catch (error) {
      console.log('error--', error?.response?.data);
      setLoader(false)
    }
  };

  useEffect(() => {
    NotidyData();
  }, [navigation]);

  return (
    <ScreenWithBackground>
      <SafeAreaView style={styles.screen}>
        <Header
          backicon={true}
          headerText={'Notification'}
          backgroundColor={COLORS.base}
          tintColor={COLORS.white}
        />
        <View style={styles.RemainingScreen}>
          <FlatList
            data={notification}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 60}}
            inverted
            renderItem={({item}) => {
              return (
                <>
                  <View style={styles.container}>
                    <Image
                      source={
                        userData?.profileImage
                          ? {uri: userData?.profileImage}
                          : require('../assets/images/pictures/profile3.png')
                      }
                      style={{height: 50, width: 50, borderRadius: 10,marginTop:10}}
                      resizeMode="cover"
                    />
                    <View style={{flex: 1}}>
                      <Text style={styles.nameText}>{item.Name}</Text>
                      <Text
                        style={{
                          ...styles.nameText,
                          fontFamily: FONTS.Inter400,
                        }}>
                        {item.message}
                      </Text>
                      <Text
                        style={{
                          ...styles.nameText,
                          fontSize: fontScale * 12,
                          fontFamily: FONTS.Inter400,
                          lineHeight: 17,
                        }}>
                        {item?.created_at}
                      </Text>
                    </View>
                    <TouchableOpacity>
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
          />
        </View>
        {loader&&<ScreenLoader isProcessing={loader}/>}
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
});
