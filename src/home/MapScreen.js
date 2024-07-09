import {Dimensions, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import COLORS from '../theme/Colors';
import Header from '../components/Header';

const {height, width} = Dimensions.get('screen');

const MapScreen = props => {
  const {data} = props?.route?.params;
  console.log('data--', data);
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header backicon={true} tintColor={'#000'} />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: parseFloat(data?.latitude) || 51.522751,
          longitude: parseFloat(data?.longitude) || -0.72021,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}>
        <Marker coordinate={{latitude: parseFloat(data?.latitude) || 51.522751, longitude: parseFloat(data?.longitude) || -0.72021}} />
      </MapView>
    </SafeAreaView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
