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
  Text,
  Platform
} from 'react-native';
import Header from '../components/Header';
import COLORS from '../theme/Colors';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const { height, width } = Dimensions.get('screen');
const GridImageView = (props) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {data} = props?.route?.params;
  // console.log("Image----",data)

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity onPress={() => handleImagePress(item?.image)}>
        <Image source={{uri:item?.image}} style={styles.image} resizeMode="cover" />
      </TouchableOpacity>
    </View>
  );

  const handleImagePress = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage('');
  };

  const numColumns = 3; 

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Header
        backicon={true}
        tintColor={COLORS.black}
        textcolor={COLORS.black}
        headerText={t('Photos')}
        backgroundColor={COLORS.white}
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns} // Use numColumns directly here
        contentContainerStyle={styles.flatlist}
        ListEmptyComponent={()=>{
          return(
            <View style={{justifyContent:'center',height:height*0.7,backgroundColor:COLORS.white,alignItems:'center'}}>
            <Text> {t("No")} {t("Photos")}</Text>
            </View>
          )
         
        }}
      />
      <Modal visible={modalVisible} transparent={true} onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalClose} onPress={closeModal}>
            <Image source={require('../assets/images/icons/close.png')} style={{height:15,width:15}}/>
          </TouchableOpacity>
          <Image source={{uri:selectedImage}} style={styles.modalImage} resizeMode="contain" />
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
    top: Platform.OS === 'ios'? 60: 20,
    right: 20,
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 5,
  },
  modalImage: {
    width: width * 0.9,
    height: height * 0.7,
    borderRadius: 10,
  },
});

export default GridImageView;
