import {
  Dimensions,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import React, {useState} from 'react';
import COLORS from '../theme/Colors';
const {width, height, fontScale} = Dimensions.get('window');

export default function CallModal({
  title,
  subTitle,
  isOpens,
  setIsOpens,
  imgSource,
  props,
  callData,
}) {
  const [isPointsDeducted, setIsPointsDeducted] = useState(false);
  // console.log("CALLLL ",callData)
  const MakeCall = () => {
    const phoneNumber = callData?.mobilenumber;
    const androidDial = `tel:${phoneNumber}`;
    const iosDial = `tel:${phoneNumber.replace(/\s/g, '')}`;
    Linking.openURL(Platform.OS === 'ios' ? iosDial : androidDial).catch(
      error => {
        console.error('Error opening URL:', error);
      },
    );
  };

  return (
    <>
      <Modal
        isVisible={isOpens}
        onSwipeComplete={() => setIsOpens(false)}
        swipeDirection="down"
        backdropColor="rgba(0,0,0,0.4)"
        onBackdropPress={() => setIsOpens(false)}
        onBackButtonPress={() => setIsOpens(false)}
        style={[styles.container]}>
        <View style={styles.innercontainer}>
          {/* line Bar */}
          <View style={styles.linebar} />
          <View style={{paddingTop: 25, paddingBottom: 10}}>
            <Image
              source={require('../assets/images/icons/business.png')}
              resizeMode="contain"
              style={{
                width: 65,
                height: 65,
                alignSelf: 'center',
              }}
            />
          </View>

          <Text style={styles.headText}>Contact {callData?.title}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 8,
              paddingVertical: 15,
            }}>
            <Image
              source={require('../assets/images/icons/phone-call.png')}
              style={{width: 20, height: 20}}
              resizeMode="contain"
            />

            <Text style={styles.descText}>{' +'} {callData?.mobilenumber}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 24,
              marginBottom: 8,
            }}>
            <TouchableOpacity
              onPress={() => MakeCall()}
              // onPress={() => setIsOpens(false)}
              style={{
                backgroundColor: '#ECECEC',

                flex: 0.95,
                paddingVertical: 10,
                borderRadius: 50,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#262626',
                  textAlign: 'center',
                  fontWeight: '500',
                }}>
                Call Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // card details
  tandcText: {
    color: '#212121',
    fontFamily: 'SF Pro Display',
    fontSize: 16,
    lineHeight: 20,
    marginTop: 28,
  },
  redeemTextDetails: {
    color: '#757575',
    fontFamily: 'SF Pro Display',
    fontSize: 16,
    lineHeight: 20,
  },
  cardMoneyText: {
    fontFamily: 'SF Pro Display',
    fontSize: 16,
    color: '#757575',
    lineHeight: 20,
  },
  cardMoneyInnerContainer: {
    backgroundColor: '#757575',
    width: 4,
    height: 5,
    borderRadius: 2,
  },
  cardMoneyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    paddingTop: 6,
  },
  cardHeadText: {
    fontFamily: 'SF Pro Display',
    fontWeight: '500',
    fontSize: 20,
    color: '#212121',
    lineHeight: 20,
    alignSelf: 'center',
    marginTop: 12,
  },
  cardLocationText: {
    fontFamily: 'SF Pro Display',
    fontSize: 16,
    color: '#212121',
    lineHeight: 20,
    alignSelf: 'center',
  },
  cardMoneyText: {
    fontFamily: 'SF Pro Display',
    fontSize: 12,
    color: '#757575',
    lineHeight: 14,
    alignSelf: 'center',
  },
  descText: {
    fontSize: fontScale * 18,
    color: COLORS.primary,
    textAlign: 'center',
  },
  cardImage: {
    width: 64,
    height: 64,
    alignSelf: 'center',
  },

  // bar line
  linebar: {
    borderBottomColor: '#E8E8E8',
    width: width * 0.2,
    borderBottomWidth: 3,
    alignSelf: 'center',
  },
  headText: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: 22,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '500',
    paddingVertical: 8,
  },
  // modal container
  container: {
    flex: 1,
    position: 'relative',
    margin: 0,
  },
  innercontainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
    margin: 16,
  },
  textStyle: {
    fontFamily: 'SF Pro Display',
    color: '#212121',
  },
});
