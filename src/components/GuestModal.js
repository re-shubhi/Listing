import { Dimensions, Image, Modal, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import Button from './Button';
import COLORS from '../theme/Colors';

const{height,width,fontScale} = Dimensions.get('screen');

export default GuestModal = ({ visible, onClose, navigation }) => {
    const hideGuestModal = () => {
      onClose();
    };
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={hideGuestModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 10,
              width: '80%',
              padding: 10,
            }}
          >
            <TouchableOpacity
              style={{alignSelf:"flex-end"}}
              onPress={hideGuestModal}
            >
              <Image
                source={require('../assets/images/icons/close.png')}
                style={{ height: 15, width: 15 }}
              />
            </TouchableOpacity>
            <View style={{ padding: 30, alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: fontScale * 18,
                  marginBottom: 10,
                  textAlign: 'center',
                }}
              >
                Please register to access this feature
              </Text>
              <Button
                buttonTxt={'Register'}
                width={width * 0.6}
                onPress={() => {
                  navigation.navigate('Register');
                  hideGuestModal();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  