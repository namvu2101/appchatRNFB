import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';

export default function Loading({isVisible}) {
  return (
    <Modal isVisible={isVisible}>
      <View
        style={{
          height: 111,
          marginHorizontal: 77,
          alignContent: 'center',
          justifyContent: 'center',
          opacity:0.8
        }}>
        <ActivityIndicator size={'large'} color={'#fff'} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({});
