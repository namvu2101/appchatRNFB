import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Avatar, Badge} from 'react-native-paper';
import {FONTS, COLORS, images, SIZES} from '../../constants';
import {useNavigation} from '@react-navigation/native';

export default function Friend_Item({item, userId}) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Chats', {
          item: item.data,
          type: 'Person',
          conversation_id: `${userId}-${item.id}`,
          recipientId: item.id,
        })
      }
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: 66,
        height: 77,
      }}>
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
        <Avatar.Image
          source={{uri: item.data.image || images.imageLoading}}
          size={50}
        />
        {item.data.isOnline && (
          <Badge
            size={15}
            style={{
              position: 'absolute',
              backgroundColor: COLORS.green,
              borderColor: COLORS.white,
              borderWidth: 2,
              bottom: 0,
              right: 0,
            }}
          />
        )}
      </View>

      <Text style={{color: COLORS.black, flex: 1}} numberOfLines={1}>
        {item.data.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
