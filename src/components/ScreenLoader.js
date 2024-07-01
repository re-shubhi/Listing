import React from 'react';
import {useContext} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

const {width, height} = Dimensions.get('window');

const ScreenLoader = ({
  visible,
  isProcessing,
  onRequestClose,
  closeModal,
  pressButton,
  data,
  type,
}) => {
  return (
    <>
      <StatusBar backgroundColor={'transparent'} />
      <Modal
        transparent={true}
        visible={visible}
        onRequestClose={closeModal}
        style={{
          background: 'transparent !important',
          backdropFilter: 'blur(3px)',
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(48, 48, 48, 0.6)',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </Modal>
    </>
  );
};

export default ScreenLoader;

const styles = StyleSheet.create({
  btntxt: {
    fontSize: 15,
  },

  img: {
    alignSelf: 'center',
    width: 110,
    height: 110,
    resizeMode: 'contain',
    marginTop: 50,
  },
  mainContainer: {
    flex: 1,
    // backgroundColor: currentTheme.colors.background,
  },

  row: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  inputview: {
    height: height * 0.07,
    width: width * 0.9,
    // backgroundColor: currentTheme.colors.input1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'relative',
    marginTop: 15,
    paddingHorizontal: 10,
    paddingTop: 4,
    marginVertical: 15,
  },
});
