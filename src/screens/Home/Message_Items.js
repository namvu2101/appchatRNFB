import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {FONTS, COLORS, images, SIZES} from '../../constants';
import {Avatar} from 'react-native-paper';

export default function Message_Items({item, index, onPress}) {
  return (
    <TouchableOpacity
      key={index}
      onPress={onPress}
      style={[
        {
          width: SIZES.width,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 22,
          borderBottomColor: COLORS.secondaryWhite,
          borderBottomWidth: 1,
        },
        index % 2 == 0 && {
          backgroundColor: COLORS.tertiaryWhite,
        },
      ]}>
      <View
        style={{
          paddingVertical: 15,
          marginRight: 22,
        }}>
        {item.isOnline && item.isOnline == true && (
          <View
            style={{
              height: 14,
              width: 14,
              borderRadius: 7,
              backgroundColor: COLORS.green,
              borderColor: COLORS.white,
              borderWidth: 2,
              position: 'absolute',
              top: 14,
              right: 2,
              zIndex: 1000,
            }}></View>
        )}
        <Avatar.Image source={{uri: item?.avatar}} size={55} />
      </View>
      <View
        style={{
          flexDirection: 'column',
        }}>
        <Text style={{...FONTS.h4, marginBottom: 4, color: COLORS.black}}>
          {item.name}
        </Text>
        <Text style={{fontSize: 14, color: COLORS.secondaryGray}}>
          {item.messageText}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
