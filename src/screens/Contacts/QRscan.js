import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from 'react-native';
import React from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import PageContainer from '../../components/PageContainer';
import {Icon} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
export default function QRscan() {
  const [flashMode, setFlashMode] = React.useState(
    RNCamera.Constants.FlashMode.torch,
  );
  const navigation = useNavigation();
  const onSuccess = e => {
    navigation.replace('Information', {
      id: e.data,
    });
  };

  return (
    <PageContainer style={{justifyContent: 'center'}}>
      <QRCodeScanner
        onRead={onSuccess}
        containerStyle={{
          position: 'absolute',
          alignItems: 'center',
        }}

        // flashMode={flashMode}
      />
      <Icon source={'scan-helper'} size={300} color="white" />
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
