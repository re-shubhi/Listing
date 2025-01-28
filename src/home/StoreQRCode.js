import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ScreenWithBackground from '../components/ScreenWithBackground';
import FONTS from '../theme/Fonts';
import Header from '../components/Header';
import COLORS from '../theme/Colors';

const {height, width, fontScale} = Dimensions.get('screen');

const StoreQRCode = props => {
  const {data} = props?.route?.params;
  console.log('StoreQRCode---------->>>', data?.qrcode);

  const storeURL = data?.qrcode; // The link to the store

  return (
    <ScreenWithBackground>
      <SafeAreaView style={styles.screen}>
      <Header
          backicon={true}
          backgroundColor={COLORS.base}
          tintColor={COLORS.white}
        />
        <View style={styles.container}>
          <Image
            source={{uri: storeURL}}
            resizeMode="contain"
            style={{height: 150, width: 150}}
          />
        </View>
        <View style={{alignSelf: 'center', marginTop: height * 0.0}}>
          <Text style={styles.storeName}>{data?.title}</Text>
        </View>
      </SafeAreaView>
    </ScreenWithBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
    marginTop: height * 0.06,
  },
  storeName: {
    fontSize: fontScale * 24,
    marginBottom: 10,
    fontFamily: FONTS.Inter800,
  },
  screen: {
    flex: 1,
  },
});

export default StoreQRCode;
