import React from 'react';
import { View, StyleSheet } from 'react-native';
import COLORS from '../theme/Colors';

const ScreenWithBackground = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={styles.upperHalf}></View>
        <View style={styles.lowerHalf}></View>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  upperHalf: {
    flex: 0.3,
    backgroundColor:COLORS.base
  },
  lowerHalf: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    
  },
});

export default ScreenWithBackground;
