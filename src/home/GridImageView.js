import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Text
} from 'react-native';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('screen');
const GridImageView = () => {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const data = [
    {
      id: 1,
      img: require('../assets/images/pictures/slider.png'),
    },
    {
      id: 2,
      img: require('../assets/images/pictures/slider2.jpg'),
    },
    {
      id: 3,
      img: require('../assets/images/pictures/slider.png'),
    },
    {
      id: 4,
      img: require('../assets/images/pictures/slider.png'),
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity onPress={() => handleImagePress(item.img)}>
        <Image source={item.img} style={styles.image} resizeMode="cover" />
      </TouchableOpacity>
    </View>
  );

  const handleImagePress = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const numColumns = 3; 

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Header
        backicon={true}
        tintColor={COLORS.white}
        headerText={'Photos'}
        backgroundColor={COLORS.base}
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns} // Use numColumns directly here
        contentContainerStyle={styles.flatlist}
      />
      <Modal visible={modalVisible} transparent={true} onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalClose} onPress={closeModal}>
            <Image source={require('../assets/images/icons/close.png')} style={{height:15,width:15}}/>
          </TouchableOpacity>
          <Image source={selectedImage} style={styles.modalImage} resizeMode="contain" />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flatlist: {
    padding: 5,
    backgroundColor: COLORS.white,
  },
  item: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 5,
  },
  image: {
    height: height * 0.15,
    width: width * 0.3,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalClose: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 5,
  },
  modalCloseText: {
    fontSize: 16,
    color: COLORS.base,
  },
  modalImage: {
    width: width * 0.9,
    height: height * 0.7,
    borderRadius: 10,
  },
});

export default GridImageView;
