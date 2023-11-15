import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Dialog} from '@rneui/themed';
import {FONTS} from '../../constants';
import {Button} from 'react-native-paper';

export default function Message_Dialog({isVissible, onClose}) {
  return (
    <View style={{height: 100, backgroundColor: 'white'}}>
      <Dialog.Title title="Thông báo" titleStyle={FONTS.h3} />
      <Text style={FONTS.h3}>Chức năng đang cập nhật</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
