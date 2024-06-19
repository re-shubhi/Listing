import {
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import { useNavigation } from '@react-navigation/native';

const {height, width, fontScale} = Dimensions.get('screen');

const ProfileScreen = () => {
  const navigation = useNavigation();
  return (
    <>
      <SafeAreaView style={styles.screen}>
        <Header
          backicon={true}
          headerText={'Profile'}
          backgroundColor={COLORS.base}
          tintColor={COLORS.white}
        />
        <View style={styles.container}>
          <Image
            source={require('../assets/images/pictures/profile.png')}
            style={{height: 64, width: 64, borderRadius: 10}}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.name}>Andrew R. Whitesides</Text>
            <Text
              style={{
                ...styles.name,
                fontSize: fontScale * 15,
                lineHeight: 20,
              }}>
              andrewwhitesides@gmail.com
            </Text>
          </View>
        </View>
        <View style={styles.RemainingScreen}>
          <View style={[styles.OptionContainer, styles.boxWithShadow]}>
            <TouchableOpacity style={styles.IconButton} onPress={()=>navigation.navigate("Wishlist")}>
              <Image
                source={require('../assets/images/icons/heart.png')}
                style={{height: 24, width: 24}}
                resizeMode="contain"
              />
              <Text style={styles.iconText}>Wishlist</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.IconButton}>
              <Image
                source={require('../assets/images/icons/star.png')}
                style={{height: 24, width: 24}}
                resizeMode="contain"
              />
              <Text style={styles.iconText}>Following</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.IconButton}>
              <Image
                source={require('../assets/images/icons/chat2.png')}
                style={{height: 24, width: 24}}
                resizeMode="contain"
              />
              <Text style={styles.iconText}>Messages</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.ContainerBox, styles.boxWithShadow]}>
            <View style={styles.box}>
              <Text style={styles.Heading}>Basic Details</Text>
              <TouchableOpacity>
                <Image
                  source={require('../assets/images/icons/edit.png')}
                  style={{height: 20, width: 20}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.box}>
              <Text style={styles.Heading}>Name</Text>
              <Text style={styles.subText}>Andrew R. Whitesides</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.Heading}>Email</Text>
              <Text style={styles.subText}>andrewwhitesides@gmail.com</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.Heading}>Gander</Text>
              <Text style={styles.subText}>Male</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.Heading}>DOB</Text>
              <Text style={styles.subText}>1993-12-12</Text>
            </View>
          </View>
        </View>
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
    fontSize: fontScale * 20,
    fontFamily: FONTS.Inter500,
    lineHeight: 24.2,
  },
  container: {
    backgroundColor: COLORS.base,
    paddingVertical: height * 0.02,
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
    paddingHorizontal: width * 0.05,
    borderRadius: 10,
    borderWidth: 0.16,
  },
  boxWithShadow: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 5,
  },
  icon: {
    height: 24,
    width: 24,
  },
  IconButton: {
    alignItems: 'center',
    paddingVertical: height * 0.01,
    rowGap: 10,
  },
  iconText: {
    fontSize: fontScale * 16,
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
    borderWidth: 0.16,
    marginVertical: height * 0.02,
  },
  Heading: {
    fontSize: fontScale * 17,
    fontFamily: FONTS.Inter400,
    lineHeight: 21,
    color: COLORS.base,
  },
  subText: {
    fontSize: fontScale * 15,
    fontFamily: FONTS.Inter500,
    lineHeight: 19,
    color: COLORS.base,
  },
});
