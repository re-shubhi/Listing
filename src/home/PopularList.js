import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import FONTS from '../theme/Fonts';
import COLORS from '../theme/Colors';
import CardData from '../heart/CardData';

const {height, width, fontScale} = Dimensions.get('screen');
const PopularList = () => {
  const [data, setData] = useState(CardData);
  const toggleHeart = index => {
    const newData = [...CardData];
    newData[index].liked = !newData[index].liked;
    setData(newData);
  };
  return (
    <>
      <FlatList
        data={CardData}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item,index}) => {
          return (
            <TouchableOpacity style={[styles.box, styles.boxWithShadow]}>
              <Image
                source={item.img}
                style={{height: 90, width: 90, borderRadius: 10}}
                resizeMode="cover"
              />
              <View style={{rowGap: 4}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.CardTitle}>{item.title}</Text>
                  <TouchableOpacity onPress={()=>toggleHeart(index)}>
                    <Image
                      source={ item.liked ?require('../assets/images/icons/redheart.png'): require('../assets/images/icons/heart.png')}
                      style={{height: 15, width: 15}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.address}>{item.address}</Text>
                <View style={styles.lastcontainer}>
                  <View style={{flexDirection: 'row', columnGap: 5}}>
                    <Image
                      source={require('../assets/images/icons/star2.png')}
                      style={{height: 18, width: 18}}
                      resizeMode="contain"
                    />
                    <Text style={styles.rate}>{item.rating}</Text>
                  </View>
                  <View style={{flexDirection: 'row', columnGap: 5}}>
                    <Image
                      source={require('../assets/images/icons/location.png')}
                      style={{height: 18, width: 18}}
                      resizeMode="contain"
                    />
                    <Text style={styles.rate}>{item.distance}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => {
            return <View style={styles.seperator} />;
          }}
      />
    </>
  );
};

export default PopularList;

const styles = StyleSheet.create({
  lastcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: width * 0.05,
    paddingVertical: 5,

    // alignItems: 'center',
  },
  CardTitle: {
    fontSize: fontScale * 17,
    fontFamily: FONTS.Inter600,
    lineHeight: 21,
    color: COLORS.base,
  },
  address: {
    fontSize: fontScale * 15,
    lineHeight: 19,
    fontFamily: FONTS.Inter400,
    color: COLORS.base,
  },
  box: {
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
    padding: 4,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.cardsBorderColor,
    marginVertical: height * 0.01,
  },
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
  seperator: {width: 15, backgroundColor: 'transparent'},
});
