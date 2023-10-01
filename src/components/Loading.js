import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {ActivityIndicator} from 'react-native-paper';

export default function Loading({isVisible}) {
  return (
    <Modal isVisible={isVisible}>
      <ActivityIndicator size={50} color={'#fff'} />
    </Modal>
  );
}

const styles = StyleSheet.create({});
