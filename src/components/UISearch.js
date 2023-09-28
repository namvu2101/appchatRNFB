import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Searchbar} from 'react-native-paper';
import {COLORS} from '../constants';

export default function UISearch(props) {
  return (
    <Searchbar
      onIconPress={props.onPress}
      placeholder="  Search"
      placeholderTextColor={COLORS.gray}
      onChangeText={props.onChangeText}
      value={props.value}
      cursorColor={'#000'}
      iconColor="#000"
      style={{...styles.container, ...props.style}}
      inputStyle={{color: '#000'}}
      onSubmitEditing={props.onPress}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 22,
    backgroundColor: COLORS.secondaryWhite,
    height: 48,
    marginVertical: 22,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
});
