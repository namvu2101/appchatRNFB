import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Searchbar} from 'react-native-paper';
import {COLORS} from '../constants';

export default function UISearch(props) {
  return (
    <Searchbar
      onIconPress={props.onPress}
      placeholder="  Tìm kiếm"
      placeholderTextColor={COLORS.gray}
      onChangeText={props.onChangeText}
      value={props.value}
      cursorColor={'#000'}
      iconColor="#000"
      style={{...styles.container, ...props.style}}
      inputStyle={{color: '#000',textAlignVertical:'top'}}
      onSubmitEditing={props.onPress}
      
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 22,
    backgroundColor: COLORS.secondaryWhite,
    marginVertical: 22,
    borderRadius: 20,
    height:40,
  },
});
