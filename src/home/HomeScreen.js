import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../components/Header'
import COLORS from '../theme/Colors'

const HomeScreen = () => {
  return (
 <SafeAreaView style={styles.screen}> 
  <Header headerText={"Home"}/>
 </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  screen:{
    // flex:1,
    backgroundColor:COLORS.base
  }
})