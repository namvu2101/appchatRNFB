import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {images} from '../../constants';
import QRCode from 'react-native-qrcode-svg';
import {authStore} from '../../store';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
export default function Qrcode() {
  const {userId} = authStore();
  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer style={{justifyContent: 'center'}}>
        <QRCode value={userId} size={200} />
      </PageContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
