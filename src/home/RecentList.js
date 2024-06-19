import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import CardData from '../heart/CardData';
import {useNavigation} from '@react-navigation/native';

const {height, width, fontScale} = Dimensions.get('screen');

const RecentList = () => {
  const navigation = useNavigation();
  const [numColumns, setNumColumns] = useState(2);
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
        key={`${numColumns}`} // Change key when numColumns changes
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        renderItem={({item,index}) => {
          return (
            <>
              <TouchableOpacity
                TouchableOpacity
                style={[styles.card, styles.boxWithShadow]}
                onPress={() => navigation.navigate('DetailScreen')}>
                <Image
                  source={item.img}
                  style={styles.banner}
                  resizeMode="cover"
                />
                <View style={styles.content}>
                  <Text numberOfLines={1} style={styles.CardTitle}>
                    {item.title}
                  </Text>
                  <TouchableOpacity onPress={() => toggleHeart(index)}>
                    <Image
                      source={
                        item.liked
                          ? require('../assets/images/icons/redheart.png')
                          : require('../assets/images/icons/heart.png')
                      }
                      style={{height: 20, width: 20}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                <Text numberOfLines={1} style={styles.address}>
                  {item.address}
                </Text>
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
              </TouchableOpacity>
            </>
          );
        }}
        ItemSeparatorComponent={() => {
          return <View style={styles.seperator} />;
        }}
      />
    </>
  );
};

export default RecentList;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    maxWidth: 185,
    padding: 10,
    maxHeight: 200,
    borderWidth: 0.15,
    marginHorizontal: 2,
    borderRadius: 10,
    marginTop: 5,
  },
  banner: {height: 90, width: 170, alignSelf: 'center', borderRadius: 10},
  boxWithShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  lastcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: width * 0.05,
    paddingVertical: 5,
    paddingLeft: 5,
    alignItems: 'center',
  },
  seperator: {height: 10, backgroundColor: 'transparent'},
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
    paddingHorizontal: 5,
  },
  rate: {
    fontSize: fontScale * 15,
    lineHeight: 19,
    fontFamily: FONTS.Inter400,
    color: COLORS.base,
  },
});
