import { StyleSheet, Text, View,TouchableOpacity, Dimensions, Platform } from 'react-native'
import React from 'react'
import COLORS from '../theme/Colors'
import FONTS from '../theme/Fonts'

const{height,width,fontScale} = Dimensions.get("screen")

const Button = ({buttonTxt,onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{buttonTxt}</Text>
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
    button:{
        backgroundColor:COLORS.primary,
        alignItems:"center",
        paddingVertical:Platform.OS ==='ios'?20: 15,
        borderRadius:10,
    },
    buttonText:{
        color:COLORS.white,
        fontSize:fontScale*17,
        fontFamily:FONTS.Inter600
    }
})