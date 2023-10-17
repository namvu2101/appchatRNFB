import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Avatar, List} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../../constants';
import {authStore} from '../../store';
export default function Custom_item({item, index}) {
  const navigation = useNavigation();
  const {userId} = authStore();
  return (
    <List.Item
      onPress={() => {
        navigation.navigate('Chats', {
          item: item.data,
          type: 'Person',
          conversation_id: `${userId}-${item.id}`,
          recipientId: item.id,
        });
      }}
      key={item.data.id}
      title={item.data.name}
      descriptionNumberOfLines={1}
      titleStyle={{...FONTS.h3}}
      style={{
        backgroundColor: index % 2 == 0 && COLORS.secondaryWhite,
        paddingVertical: -10,
      }}
      // description={item.phone}
      // descriptionStyle={{color: '#000', fontWeight: 'bold'}}
      left={props => (
        <Avatar.Image source={{uri: item.data.image}} size={50} {...props} />
      )}
    />
  );
}

const styles = StyleSheet.create({});
