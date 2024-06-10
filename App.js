import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FONTS from './src/theme/Fonts';
import COLORS from './src/theme/Colors';


const App = () => {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome</Text>
        <View style={{flexDirection:"row"}}>
        <Text style={{...styles.name,color:COLORS.primary}}>L</Text>
        <Text style={styles.name}>isting App</Text>
        </View>
       
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.initial,
    justifyContent: 'center',
  },
  container: {
    alignSelf: 'center',
    alignItems:"center"
  },
  welcome:{
    fontSize:17,
    fontFamily:FONTS.Inter600,
    color:COLORS.black
  },
  name:{
    fontSize:38,
    color:"#00000",
    fontFamily:FONTS.Inter600
  }
});
