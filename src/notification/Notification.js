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
import React from 'react';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import NotificationData from './NotificationData';
import ScreenWithBackground from '../components/ScreenWithBackground';

const {height, width, fontScale} = Dimensions.get('screen');

const Notification = () => {
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
          data={NotificationData}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 60}}
          renderItem={({item}) => {
            return (
              <>
                <View
                  style={styles.container}>
                  <Image
                    source={item.img}
                    style={{height: 50, width: 50}}
                    resizeMode="contain"
                  />
                  <View style={{flex: 1}}>
                    <Text style={styles.nameText}>{item.Name}</Text>
                    <Text
                      style={{...styles.nameText, fontFamily: FONTS.Inter400}}>
                      {item.notification}
                    </Text>
                    <Text
                      style={{
                        ...styles.nameText,
                        fontSize: fontScale * 12,
                        fontFamily: FONTS.Inter400,
                        lineHeight: 17,
                      }}>
                      {item.time}
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
    marginHorizontal:width*0.02,
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
  container:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 10,
    paddingVertical: height * 0.01,
    alignItems:"center"
  }
});
