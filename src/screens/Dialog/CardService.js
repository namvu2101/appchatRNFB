import {StyleSheet, Text, View, Image, TextInput} from 'react-native';
import React from 'react';
import {Card, Icon} from '@rneui/themed';
import {COLORS, FONTS, SIZES} from '../../constants';
import UITextInput from '../../components/UITextInput';
import UIButton from '../../components/UIButton';

export default function CardService(props) {
  return (
    <View
      style={{
        alignItems: 'center',
        height: SIZES.height / 2,
        backgroundColor: 'white',
        margin: 22,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
      }}>
      <Image
        source={{uri: props.image}}
        style={{
          height: '50%',
          width: '100%',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}
      />

      <Text
        style={{
          ...FONTS.h3,
          fontWeight: 'bold',
          alignSelf: 'flex-start',
          padding: 10,
          width: '100%',
        }}
        numberOfLines={2}>
        {props.title}
      </Text>
      <Text
        style={{
          ...FONTS.h4,
          alignSelf: 'flex-start',
          padding: 10,
          width: '100%',
        }}
        numberOfLines={3}>
        {props.detail}
      </Text>
      <UIButton title="Đăng" onPress={props.onPress} />
    </View>
  );
}

const styles = StyleSheet.create({});
