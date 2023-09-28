import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {COLORS, FONTS, SIZES} from '../../constants';
import {useNavigation} from '@react-navigation/native';

export default function Custom_items({item, index}) {
  const navigation = useNavigation();
  const formatTime = time => {
    const jsDate = time.toDate();
    const options = {hour: 'numeric', minute: 'numeric'};
    return new Date(jsDate).toLocaleString('en-US', options);
  };
  return (
    <TouchableOpacity
      key={index}
      onPress={() => {
        // navigation.navigate('PersonalChat', {
        //   userName: item.userName,
        // })
      }}
      style={[
        {
          width: SIZES.width,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 22,
          borderBottomColor: COLORS.secondaryWhite,
          borderBottomWidth: 1,
          justifyContent: 'space-between',
        },
        index % 2 !== 0
          ? {
              backgroundColor: COLORS.tertiaryWhite,
            }
          : null,
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

        <Image
          source={{uri: item.image}}
          resizeMode="contain"
          style={{
            height: 50,
            width: 50,
            borderRadius: 25,
          }}
        />
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{...FONTS.h4, marginBottom: 4, color: COLORS.black}}>
          {item.name}
        </Text>
        <Text style={{fontSize: 14, color: COLORS.secondaryGray}}>
          {item.phone}
        </Text>
      </View>
      <Text
        style={{...FONTS.h4, marginBottom: 4, color: COLORS.secondaryBlack}}>
        {formatTime(item?.last_active_at)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
