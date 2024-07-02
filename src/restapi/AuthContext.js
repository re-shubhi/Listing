import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import {getPopnProfile} from './ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = React.createContext();

const AuthContextProvider = ({children}) => {
  const [userData, setUserData] = useState({});

  //*************************USER PROFILE DATA********************
  const getProfileData = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios({
        method: 'POST',
        url: getPopnProfile,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      console.log('data--', response);
      if(response?.data?.status === true)
        {
          setUserData(response?.data)
        }
    } catch (error) {
      console.log('error user', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        getProfileData
      }}>
      {children}
    </AuthContext.Provider>
  );
};



export {AuthContext, AuthContextProvider};
