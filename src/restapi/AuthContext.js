import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {getPopnProfile, product} from './ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const AuthContext = React.createContext();

const AuthContextProvider = ({children}) => {

  const [userData, setUserData] = useState({});
  const [productListing, setProductListing] = useState([]);

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
      console.log('data--', response);
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
      method:'POST',
      url:product,  
    })
    console.log("Response Product ---",response?.data)
    if(response?.data?.status === true)
      {
        setProductListing(response?.data?.data)
      }
  } catch (error) {
    console.log("product error",error?.response)
  }
}

  useEffect(() => {
    getProfileData();
    ProductListing()
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        getProfileData,
        ProductListing,
        productListing,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthContext, AuthContextProvider};
