import {Text, StyleSheet} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants';

const UIButton = props => {
  const enabledBgColor = props.color || COLORS.primary;
  const disabledBgColor = COLORS.secondaryGray;
  const bgColor = props.disabled ? disabledBgColor : enabledBgColor;

  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props.onPress}
      style={{
        ...styles.btn,
        ...{backgroundColor: bgColor},
        ...props.style,
      }}>
      <Text
        style={{
          ...FONTS.h2,
          color: COLORS.white,
        }}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    paddingVertical: SIZES.padding2,
    borderColor: COLORS.primary,
    borderRadius: SIZES.h1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
  },
});

export default UIButton;
