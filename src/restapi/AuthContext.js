import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {getPopnProfile, getWishList, product} from './ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS, openSettings } from 'react-native-permissions';

const AuthContext = React.createContext();

const AuthContextProvider = ({children}) => {
  const [userData, setUserData] = useState({});
  const [productListing, setProductListing] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [location, setLocation] = useState('');
  const [search, setSearch] = useState('');
  const [addressLocation, setAddressLocation] = useState('');
  const [locationPermission, setlocationPermission] = useState(false);

  const defaultLocation = {
    mocked: false,
    timestamp: 1701664967867,
    extras: {
      networkLocationType: 'cell',
    },
    coords: {
      speed: 0,
      heading: 0,
      altitude: 0,
      accuracy: 600,
      longitude: -122.083922,
      latitude: 37.4220936,
    },
  };

  //*************************requestPermissionLocation********************
  async function requestPermissionLocation() {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Listing App Location Permission',
            message:
              "Listing App needs access to your device's location to provide accurate information.",
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          return false;
        }
      } else if (Platform.OS === 'ios') {
        const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        // console.log('result----location', result);
        if (result === 'granted') {
          // setlocationPermission(true)
          return true;
        } else if (result === 'blocked') {
          // setlocationPermission(false)
          return false;
        } else {
          // ExitApp.exitApp();
          // setlocationPermission(false)
          return false;
        }
      }
    } catch (err) {
      // console.log(err);
      setlocationPermission(false)
      return false;
    }
  }

  //*************************FETCH ADDRESSS********************
  const fetchLocationAddress = async (latitude, longitude) => {
    try {
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyATQGHudmo58qTZY5QfT0G48vCBR1pd0-k`;
      axios
        .get(apiUrl)
        .then(response => {
          // console.log('response:', response?.data);
          const data = response.data;
          if (data.results && data.results.length > 0) {
            const address = data.results[0].formatted_address;
            setAddressLocation(address);
            // console.log('Address:', address);
          } else {
            console.log('No results found');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } catch (error) {}
  };

  //*************************GEO LOCATION DATA********************
  const getLocation = async () => {
    const result = requestPermissionLocation();

    result.then(res => {
      // console.log('res is:-------1698', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            // console.log('position-------', position);
            setLocation(position);
            fetchLocationAddress(
              position?.coords?.latitude,
              position?.coords?.longitude,
            );
          },
          error => {
            // ExitApp.exitApp();
            // console.log('sdgdsfhdsh----198', error);
          },
          {enableHighAccuracy: false, timeout: 15000},
        );
      } else {
        // ExitApp.exitApp();

        console.log('location permission decline');
      }
    });
    console.log('location', location);
  };

  //*************************USER PROFILE DATA********************
  const getProfileData = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios({
        method: 'POST',
        url: getPopnProfile,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log('data--', response);
      if (response?.data?.status === true) {
        setUserData(response?.data);
      }
    } catch (error) {
      console.log('error user', error?.response?.data?.message);
    }
  };
  //*************************PRODUCTS LISTING********************
  const ProductListing = async () => {
    try {
      const response = await axios({
        method: 'POST',
        url: product,
        data:{
          title:search
        }
      });
      // console.log('Response Product ---', response?.data);
      if (response?.data?.status === true) {
        setProductListing(response?.data?.data);
      }
    } catch (error) {
      console.log('product error', error?.response);
    }
  };
  //*************************WISH LIST********************
  const ListWishlist = async () => {
    const token = await AsyncStorage.getItem('token');
    // console.log("tokentoken",token)
    try {
      const response = await axios({
        method: 'POST',
        url: getWishList,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log('resss---', response?.data);
      if (response?.data?.status === true) {
        setWishlist(response?.data?.list);
      }
    } catch (error) {
      console.log('error wishlist', error?.response);
    }
  };

  useEffect(() => {
    getProfileData();
    ProductListing();
    ListWishlist();
    getLocation();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        getProfileData,
        ProductListing,
        productListing,
        ListWishlist,
        wishlist,
        defaultLocation,
        location,
        addressLocation,
        getLocation,
        search,
        setSearch,
        setlocationPermission,
        locationPermission
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthContext, AuthContextProvider};
