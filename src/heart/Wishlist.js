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
import ScreenWithBackground from '../components/ScreenWithBackground';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import CardData from './CardData';

const {height, width, fontScale} = Dimensions.get('screen');

const Wishlist = () => {
  const [numColumns, setNumColumns] = useState(2); // State for the number of columns

  return (
    <ScreenWithBackground>
      <SafeAreaView style={styles.container}>
        <Header
          backicon={true}
          backgroundColor={COLORS.base}
          tintColor={COLORS.white}
          headerText={'Wishlist'}
        />
        <View style={styles.fullScreenRed}>
          {/* FlatList with dynamically changing numColumns */}
          <FlatList
            data={CardData}
            key={`${numColumns}`} // Change key when numColumns changes
            numColumns={numColumns}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              return (
                <>
                  <TouchableOpacity TouchableOpacity style={styles.card}>
                    <Image
                      source={item.img}
                      style={styles.banner}
                      resizeMode="cover"
                    />
                    <View style={styles.content}>
                      <Text numberOfLines={1} style={styles.CardTitle}>
                        {item.title}
                      </Text>
                      <TouchableOpacity>
                        <Image
                          source={require('../assets/images/icons/redheart.png')}
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
        </View>
      </SafeAreaView>
    </ScreenWithBackground>
  );
};

export default Wishlist;

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
  CardTitle: {
    fontSize: fontScale * 17,
    fontFamily: FONTS.Inter600,
    lineHeight: 21,
    color: COLORS.black,
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
  card: {
    backgroundColor: COLORS.white,
    maxWidth: 185,
    padding: 10,
    maxHeight: 200,
    borderWidth: 0.2,
    marginHorizontal: 2,
  },
  banner: {height: 90, width: 170, alignSelf: 'center', borderRadius: 10},
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
});
