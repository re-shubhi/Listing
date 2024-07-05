import React, {useContext, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenWithBackground from '../components/ScreenWithBackground';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import CardData from '../heart/CardData';
import {useNavigation} from '@react-navigation/native';
import { AuthContext } from '../restapi/AuthContext';

const {height, width, fontScale} = Dimensions.get('screen');

const ParticularCategory = (props) => {
  const navigation = useNavigation();
  const [numColumns, setNumColumns] = useState(2);
  const {data} = props?.route?.params;
  console.log("CATEGORY name---",data?.title);
  const {productListing} = useContext(AuthContext);
  console.log("PARTICULAR--productListing",productListing)
  
  const Listing = productListing?.filter((item)=>item.category == data?.title)
  console.log("LISTINGG",Listing)
  
  // const [data, setData] = useState(CardData);
  const toggleHeart = index => {
    const newData = [...CardData];
    newData[index].liked = !newData[index].liked;
    setData(newData);
  };
  return (
    <ScreenWithBackground>
      <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.base} barStyle={'dark-content'} />
        <Header
          backicon={true}
          backgroundColor={COLORS.base}
          tintColor={COLORS.white}
          headerText={data?.title}
        />

        <View style={styles.fullScreenRed}>
          <FlatList
            data={Listing}
            key={`${numColumns}`} // Change key when numColumns changes
            numColumns={numColumns}
            showsVerticalScrollIndicator={false}
            renderItem={({item,index}) => {
              return (
                <>
                  <TouchableOpacity
                    TouchableOpacity
                    style={[styles.card, styles.boxWithShadow]}
                    onPress={() => navigation.navigate('DetailScreen',{data:item})}>
                    <Image
                      source={{uri:item?.image}}
                      style={styles.banner}
                      resizeMode="cover"
                    />
                    <View style={styles.content}>
                      <Text numberOfLines={1} style={styles.CardTitle}>
                        {item.title}
                      </Text>
                      <TouchableOpacity  onPress={() => toggleHeart(index)}>
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
            ListEmptyComponent={()=>{
              return(
                <View style={{justifyContent:'center',height:height*0.7,backgroundColor:COLORS.white,alignItems:'center'}}>
                <Text>No Data Found</Text>
                </View>
              )
             
            }}
          />
        </View>
      </SafeAreaView>
    </ScreenWithBackground>
  );
};

export default ParticularCategory;

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
    alignItems: 'center',
    paddingVertical: Platform.OS === 'ios' ? height * 0.01 : height * 0.005,
  },
  CardTitle: {
    fontSize: fontScale * 16,
    fontFamily: FONTS.Inter600,
    lineHeight: 21,
    color: COLORS.black,
  },
  address: {
    fontSize: fontScale * 14,
    lineHeight: 19,
    fontFamily: FONTS.Inter400,
    color: COLORS.base,
    paddingHorizontal: 5,
  },
  rate: {
    fontSize: fontScale * 13,
    lineHeight: 19,
    fontFamily: FONTS.Inter400,
    color: COLORS.base,
  },
  card: {
    backgroundColor: COLORS.white,
    maxWidth: width * 0.44,
    padding:  Platform.OS === 'ios' ? 10:5,
    maxHeight: height * 0.3,
    marginHorizontal: 2,
    borderRadius: 10,
    marginTop: Platform.OS === 'ios' ? 5 : 8,
  },
  banner: {
    height: height * 0.1,
    width: width * 0.42,
    alignSelf: 'center',
    borderRadius: 10,
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
  seperator: {height:Platform.OS === 'ios'?10: 0, backgroundColor: 'transparent'},
  boxWithShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 2,
  },
});
