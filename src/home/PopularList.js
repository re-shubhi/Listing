import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import FONTS from '../theme/Fonts';
import COLORS from '../theme/Colors';
import CardData from '../heart/CardData';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../restapi/AuthContext';

const {height, width, fontScale} = Dimensions.get('screen');
const PopularList = () => {
  const navigation = useNavigation();
  const [data, setData] = useState(CardData);
  const {productListing} = useContext(AuthContext);
  
  //Popular Listing
  const PopularList = productListing.filter(
    item => item.product_type === 'popular',
  );
  console.log('Popular List ===', PopularList);
  const toggleHeart = index => {
    const newData = [...CardData];
    newData[index].liked = !newData[index].liked;
    setData(newData);
  };
  return (
    <>
      <FlatList
        data={PopularList}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => {
          // console.log("item---",item)
          return (
            <TouchableOpacity
              style={[styles.box, styles.boxWithShadow]}
              onPress={() => navigation.navigate('DetailScreen',{data:item?.category_id})}>
              <Image
                source={{uri:item?.image}}
                style={{height: 90, width: 90, borderRadius: 10}}
                resizeMode="cover"
              />
              <View style={{rowGap: 4}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingRight:15
                  }}>
                  <Text style={styles.CardTitle}>{item.title}</Text>
                  <TouchableOpacity onPress={() => toggleHeart(index)}>
                    <Image
                      source={
                        item.liked
                          ? require('../assets/images/icons/redheart.png')
                          : require('../assets/images/icons/heart.png')
                      }
                      style={{height: 15, width: 15}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                <View style={{width:width*0.5}}>
                <Text  style={styles.address}>{item?.address.substring(0, 30)}</Text>
                </View>
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
    fontSize: fontScale * 13,
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
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  seperator: {width: 15, backgroundColor: 'transparent'},
});
