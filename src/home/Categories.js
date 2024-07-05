import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import ScreenWithBackground from '../components/ScreenWithBackground';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import CategoryListData from './CategoryListData';
import {useNavigation} from '@react-navigation/native';

const {height, width, fontScale} = Dimensions.get('screen');

const Categories = (props) => {
  const navigation = useNavigation();
  const [numColumns, setNumColumns] = useState(4);
  const {data} = props?.route?.params;
  console.log("CATEGORYYY",data)
  return (
    <ScreenWithBackground>
      <SafeAreaView style={styles.container}>
        <Header
          backicon={true}
          backgroundColor={COLORS.base}
          tintColor={COLORS.white}
          headerText={'Categories'}
        />
        <View style={styles.fullScreenRed}>
          <FlatList
            data={data}
            key={`${numColumns}`}
            showsVerticalScrollIndicator={false}
            numColumns={numColumns}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  style={[styles.box, styles.boxWithShadow]}
                  onPress={() => navigation.navigate('ParticularCategory',{data:item})}>
                  <Image
                    source={{uri:item.category_icon}}
                    style={{height: 24, width: 24}}
                    resizeMode="contain"
                  />
                  <Text numberOfLines={1} style={styles.CategoryText}>
                  {item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => {
              return <View style={styles.seperator} />;
            }}
          />
        </View>
       
      </SafeAreaView>
    </ScreenWithBackground>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreenRed: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: height * 0.02,
    marginHorizontal: width * 0.02,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
  },
  CategoryText: {
    fontSize: fontScale * 13,
    fontFamily: FONTS.Inter400,
    lineHeight: 19,
    color: COLORS.base,
    textAlign: 'center',
  },
  box: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardsBorderColor,
    backgroundColor: COLORS.white,
    padding: 8,
    borderRadius: 10,
    height: height * 0.07,
    width: width * 0.21,
    marginRight: 5,
  },
  seperator: {height: 5, backgroundColor: 'transparent'},
  boxWithShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});
