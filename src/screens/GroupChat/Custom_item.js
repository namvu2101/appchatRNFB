import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Avatar, List} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS, SIZES} from '../../constants';
import {authStore} from '../../store';
export default function Custom_item({item, index}) {
  const navigation = useNavigation();
  const {userId} = authStore();
  const onPress = () => {
    navigation.navigate('Chats', {
      item: item.data,
      type: 'Person',
      conversation_id: `${userId}-${item.id}`,
      recipientId: item.id,
    });
  };
  return (
    <TouchableOpacity onPress={onPress}>
      <List.Item
        title={item.data.name}
        titleStyle={{...FONTS.h3}}
        description={item.data.phone}
        titleNumberOfLines={1}

        descriptionStyle={{
          marginTop: 5,
          color: COLORS.secondaryGray,
        }}
        style={[
          {
            width: SIZES.width,
            alignItems: 'center',
            borderBottomColor: COLORS.secondaryWhite,
            borderBottomWidth: 1,
            paddingVertical: -10,
          },
          index % 2 == 0 && {
            backgroundColor: COLORS.tertiaryWhite,
          },
        ]}
        left={() => (
          <View
            style={{
              borderColor: 'blue',
              height: 54,
              width: 54,
              borderWidth: 1,
              borderRadius: 27,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                flex: 1,
                height: 14,
                width: 14,
                borderRadius: 7,
                backgroundColor: item.data.isOnline
                  ? COLORS.green
                  : COLORS.gray,
                borderColor: COLORS.white,
                borderWidth: 2,
                position: 'absolute',
                bottom: 0,
                right: 2,
                zIndex: 1000,
              }}
            />

            <Avatar.Image
              source={{
                uri: item.data.image || images.imageLoading,
              }}
              size={50}
            />
          </View>
        )}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
