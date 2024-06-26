import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import COLORS from '../theme/Colors';
const {height, width} = Dimensions.get('screen');

const MapScreen = () => {
  return (
    <View style={styles.container}>
    <MapView
      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
      style={styles.map}
      region={{
        latitude: 51.522751,
        longitude: -0.720210,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }}>
      <Marker coordinate={{latitude: 51.522751, longitude: -0.720210}} pinColor={COLORS.primary}/>
    </MapView>
  </View>
  )
}

export default MapScreen

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: height,
        width: width,
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      map: {
        ...StyleSheet.absoluteFillObject,
      },
})