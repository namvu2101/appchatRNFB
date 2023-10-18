import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TextInput} from 'react-native-paper';
import {COLORS, SIZES, FONTS} from '../constants';

export default function UITextInput(props) {
  return (
    <TextInput
      label={props.title}
      value={props.value}
      onChangeText={props.onChangeText}
      style={{...styles.input, ...props.style}}
      outlineStyle={{...props.outlinestyle}}
      mode={props.mode}
      autoFocus={props.autoFocus}
      textColor={COLORS.black}
      cursorColor={COLORS.black}
      activeUnderlineColor={COLORS.secondaryGray}
      secureTextEntry={props.secure}
      inputMode={props.inputMode}
      placeholder={props.placeholder}
      placeholderTextColor={props.placeholderTextColor}
      right={props.right}
      onSubmitEditing={props.onSubmit}
      underlineColor={props.underlineColor}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#FFFFFF',
    width: SIZES.width * 0.8,
    height: 66,
    justifyContent: 'center',
  },
});
