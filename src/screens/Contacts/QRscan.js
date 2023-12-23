import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
  Pressable,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import PageContainer from '../../components/PageContainer';
import {Icon} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {handlePickImage} from '../../components/ImagePicker';
import {UserType} from '../../contexts/UserContext';
export default function QRscan() {
  const [flashMode, setFlashMode] = React.useState(
    RNCamera.Constants.FlashMode.torch,
  );
  const {users} = useContext(UserType);
  useEffect(() => {
    navigation.setOptions({headerTitle: 'Quét mã QR'});
    },[])
  const [image, setImage] = useState('');
  const navigation = useNavigation();
  const onSuccess = e => {
    if (users.find(i => i.id == e)) {
      navigation.replace('Information', {
        id: e.data,
      });
    } else {
      Alert.alert('Thông báo!', 'Người dùng không tồn tại');
    }
  };

  const handlePickQRimage = async () => {
    const newQR = await handlePickImage();
    if (newQR != 'Error') {
      onSuccess(newQR.uri);
    }
  };
  return (
    <PageContainer style={{justifyContent: 'center'}}>
      <QRCodeScanner
        onRead={onSuccess}

        // flashMode={flashMode}
      />
      {/* <Pressable onPress={handlePickQRimage}>
        <Icon source={'camera'} size={40} color="blue" />
      </Pressable> */}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});
