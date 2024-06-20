import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import ScreenBackgroundHome from '../components/ScreenBackgroundHome';
import SwiperFlatList from 'react-native-swiper-flatlist';
import CategoryListData from './CategoryListData';
import {useNavigation} from '@react-navigation/native';
import PopularList from './PopularList';
import RecentList from './RecentList';

const {fontScale, width, height} = Dimensions.get('screen');
const images = [
  require('../assets/images/pictures/slider.png'),
  require('../assets/images/pictures/slider2.jpg'),
  require('../assets/images/pictures/slider.png'),
  require('../assets/images/pictures/slider2.jpg'),
];
const HomeScreen = () => {
  const navigation = useNavigation();
  const [numColumns, setNumColumns] = useState(4);
  const [search, setSearch] = useState('');
  return (
    <ScreenBackgroundHome>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}>
          <Header backgroundColor={COLORS.base} headerText={'Home'} />
          <View
            style={{
              paddingHorizontal: width * 0.03,
            }}>
            <View style={styles.search}>
              <Image
                source={require('../assets/images/icons/search.png')}
                style={{height: 25, width: 25}}
                resizeMode="contain"
              />
              <TextInput
                style={styles.textInput}
                placeholder="Search here"
                placeholderTextColor={COLORS.white}
                value={search}
                onChangeText={search => setSearch(search)}
              />
              <Image
                source={require('../assets/images/icons/filter.png')}
                style={{height: 25, width: 25}}
                resizeMode="contain"
              />
            </View>
            <SwiperFlatList
              autoplay
              autoplayDelay={2}
              autoplayLoop
              index={2}
              showPagination
              data={images}
              renderItem={({item}) => (
                <View style={styles.slide}>
                  <Image
                    source={item}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
              )}
              paginationStyle={{marginTop: 100}}
              paginationStyleItem={{height: 8, width: 30, marginHorizontal: 5}}
              paginationStyleItemActive={{backgroundColor: 'brown'}}
              paginationStyleItemInactive={{backgroundColor: 'orange'}}
            />
          </View>
          <View style={styles.secondHalf}>
            {CategoryListData.length > 8 && (
              <TouchableOpacity
                style={{alignSelf: 'flex-end'}}
                onPress={() => navigation.navigate('Categories')}>
                <Text style={styles.seemore}>See More</Text>
              </TouchableOpacity>
            )}
            <View style={[styles.container]}>
              <FlatList
                data={CategoryListData.slice(0, 8)}
                key={`${numColumns}`}
                showsVerticalScrollIndicator={false}
                numColumns={numColumns}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      style={[styles.box, styles.boxWithShadow]}
                      onPress={() =>
                        navigation.navigate('ParticularCategory', {data: item})
                      }>
                      <Image
                        source={item.CategoryLogo}
                        style={{height: 24, width: 24}}
                        resizeMode="contain"
                      />
                      <Text numberOfLines={1} style={styles.CategoryText}>
                        {item.category}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                ItemSeparatorComponent={() => {
                  return <View style={styles.seperator} />;
                }}
              />
            </View>

            <View>
              <Text style={styles.headingText}>Popular</Text>
              <PopularList />
              <Text
                style={[
                  styles.headingText,
                  {marginTop: Platform.OS === 'ios' ? 10 : 0},
                ]}>
                Recent
              </Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <RecentList />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackgroundHome>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  search: {
    backgroundColor: COLORS.darkgray,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 5 : 0,
    borderRadius: 10,
    marginTop: height * 0.01,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.darkgray,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: fontScale * 17,
    fontFamily: FONTS.Inter400,
    color: COLORS.white,
  },
  slide: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
    paddingRight: width * 0.06,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.04,
  },
  image: {
    height: height * 0.16,
    width: width * 0.9,
    borderRadius: 10,
  },
  seemore: {
    color: COLORS.primary,
    fontSize: fontScale * 12,
    fontFamily: FONTS.Inter500,
    lineHeight: 15,
  },
  secondHalf: {
    backgroundColor: COLORS.white,
    marginHorizontal: width * 0.02,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    padding: 10,
  },
  CategoryText: {
    fontSize: fontScale * 12,
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
    padding: 5,
    borderRadius: 10,
    height: height * 0.07,
    width: width * 0.21,
    marginRight: 5,
    marginVertical: 8,
  },
  seperator: {height: 0, backgroundColor: 'transparent'},
  boxWithShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 1,
  },
  headingText: {
    fontSize: fontScale * 16,
    color: COLORS.base,
    fontFamily: FONTS.Inter600,
    lineHeight: 21,
    paddingLeft: 5,
    marginTop: Platform.OS == 'ios' ? 0 : 8,
  },
  container: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.cardsBorderColor,
    alignItems: 'center',
    
  },
});
