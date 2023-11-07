import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Dialog} from '@rneui/themed';

export default function Loading({isVisible}) {
  return (
    <Dialog isVisible={isVisible}>
      <Dialog.Loading />
    </Dialog>
  );
}

const styles = StyleSheet.create({});
