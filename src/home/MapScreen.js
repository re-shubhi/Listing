import {Dimensions, SafeAreaView, StyleSheet, Linking, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Header from '../components/Header';
import {AuthContext} from '../restapi/AuthContext';
import { Text } from 'react-native-paper';

const {height, width} = Dimensions.get('screen');

const MapScreen = props => {
  const {data} = props?.route?.params;
  const {location} = useContext(AuthContext);
  console.log('location....', location);
  console.log('data', data);

  const userLocation = {
    latitude: parseFloat(location?.coords?.latitude),
    longitude: parseFloat(location?.coords?.longitude),
  };

  const destinationLocation = {
    latitude: parseFloat(data?.latitude),
    longitude: parseFloat(data?.longitude),
  };

  console.log('User Location:', userLocation);
  console.log('Destination Location:', destinationLocation);

  // Function to open Google Maps with directions
  const openGoogleMaps = () => {
    const origin = `${userLocation.latitude},${userLocation.longitude}`;
    const destination = `${destinationLocation.latitude},${destinationLocation.longitude}`;

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

    // Open URL in the browser or directly in Google Maps app
    Linking.openURL(url)
      .catch(err => console.error('Error opening Google Maps: ', err));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Positioned Absolutely */}
      <Header
        backicon={true}
        tintColor={'#000'}
        backgroundColor={'transparent'}
        style={styles.header} // Custom header style
      />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}>
        {/* User Location Marker */}
        <Marker coordinate={userLocation} title="Your Location" />

        {/* Destination Marker */}
        <Marker coordinate={destinationLocation} title="Destination" />
      </MapView>

      {/* Button to open Google Maps directions */}
      <TouchableOpacity style={styles.button} onPress={openGoogleMaps}>
        <Text style={styles.buttonText}>Open in Google Maps</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Ensure SafeAreaView takes full height
  },
  map: {
    flex: 1, // Ensure MapView takes all available space in SafeAreaView
  },
  header: {
    position: 'absolute', // Position the header above the map
    top: 0, // Align it to the top
    left: 0,
    right: 0,
    zIndex: 1, // Ensure the header is above the map
  },
  button: {
    position: 'absolute',
    bottom: 30,
    left: width / 2 - 100,
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    zIndex: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
