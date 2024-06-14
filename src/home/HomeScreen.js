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
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import FONTS from '../theme/Fonts';
import {ImageSlider} from '@pembajak/react-native-image-slider-banner';

const {fontScale, width, height} = Dimensions.get('screen');
const HomeScreen = () => {
  const FlatListRef = useRef();
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  //Auto Scroll
  useEffect(() => { let interval = setInterval(() => {
      if (activeIndex === imagesData.length - 1) {
        setActiveIndex(0);
      } else {
        setActiveIndex(prevIndex => prevIndex + 1);
      }
    }, 5000); // Adjust the interval duration according to your preference
  
    return () => clearInterval(interval);
  }, [activeIndex]);
  
  
  //Layout
  const getItemLayout = index => ({
    length: width,
    offset: width * index,
    index: index,
  });
  //image Data
  const imagesData = [
    {
      id: 1,
      local: require('../assets/images/pictures/slider.png'),
    },
    {
      id: 2,
      local: require('../assets/images/pictures/slider2.jpg'),
    },
    {
      id: 3,
      local: require('../assets/images/pictures/slider.png'),
    },
    {
      id: 4,
      local: require('../assets/images/pictures/slider2.jpg'),
    },
  ];
  //rendering image banner
  const renderItem = ({item}) => {
    return (
      <View>
        <Image
          source={item.local}
          style={{height: height * 0.15, width: width * 0.88, borderRadius: 10}}
          resizeMode="cover"
        />
      </View>
    );
  };

  //handle scroll
  const handleScroll = event => {
    //get scroll position
    const scroolPosition = event.nativeEvent.contentOffset.x;
    console.log({scroolPosition});
    //get the index of current visible item
    const index = scroolPosition / width;
    console.log('index', index);
    //update index
    setActiveIndex(index);
  };

  //rendering dot indicator
  const renderDotIndicator = () => {
    return imagesData.map((dot, index) => {
      return (
        <View
          key={index}
          style={{
            height: 10,
            width: 30,
            borderRadius: 10,
            backgroundColor:
              activeIndex === index ? 'red' : COLORS.lightprimary,
            marginHorizontal: 5,
          }}
        />
      );
    });
  };

  return (
    <SafeAreaView style={styles.head}>
      <Header headerText={'Home'} />
      <ScrollView>
        <View style={styles.screen}>
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
          <View style={{marginVertical: 15}}>
            <FlatList
              data={imagesData}
              ref={FlatListRef}
              getItemLayout={getItemLayout}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              horizontal={true}
              pagingEnabled={true}
              onScroll={handleScroll}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{width: 30}} />}
              contentContainerStyle={{paddingHorizontal: 15}}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              {renderDotIndicator()}
            </View>
          </View>
         
        </View>
        <View style={styles.remainingScreen}>
            <Text>hello</Text>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  head: {
    flex: 1,
    backgroundColor: COLORS.base,
  },
  screen: {
    flex: 0.4,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.008,
  },
  search: {
    backgroundColor: COLORS.darkgray,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.darkgray,
    paddingVertical: 15,
    paddingHorizontal: 10,
    fontSize: fontScale * 17,
    fontFamily: FONTS.Inter400,
    color: COLORS.white,
  },
  remainingScreen:{
    backgroundColor:COLORS.white,
  }
});
