import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Modal, Avatar} from 'react-native-paper';

const ListAvatar = ({setImage, onClose}) => {
  const listData = [
    {
      id: '1',
      photo:
        'https://th.bing.com/th/id/OIP.VSIVV3b5Nblo7gM7N4x9zgHaHZ?w=191&h=190&c=7&r=0&o=5&pid=1.7',
    },
    {
      id: '2',
      photo:
        'https://th.bing.com/th/id/OIP.audMX4ZGbvT2_GJTx2c4GgHaHw?w=182&h=190&c=7&r=0&o=5&pid=1.7',
    },
    {
      id: '3',
      photo:
        'https://th.bing.com/th/id/OIP.m5IPjbtP__xtoz0TK6DRjQHaHa?w=211&h=211&c=7&r=0&o=5&pid=1.7',
    },
    {
      id: '4',
      photo:
        'https://th.bing.com/th/id/OIP.5n41jHLjCl7Fk1NBVLkepgHaHa?w=211&h=211&c=7&r=0&o=5&pid=1.7',
    },
    {
      id: '5',
      photo:
        'https://th.bing.com/th/id/OIP.OnvcA-1dBpBRlJo6_p-nxAHaHa?w=211&h=211&c=7&r=0&o=5&pid=1.7',
    },
    {
      id: '6',
      photo:
        'https://th.bing.com/th/id/OIP.wEsBe2udHBieFeZVmus8qAHaHk?w=207&h=211&c=7&r=0&o=5&pid=1.7',
    },
    {
      id: '7',
      photo:
        'https://th.bing.com/th/id/OIP.PqBYGErQeWQWhbA_VeUBDQHaHa?w=209&h=209&c=7&r=0&o=5&pid=1.7',
    },
    {
      id: '8',
      photo:
        'https://www.w3schools.com/w3images/avatar2.png',
    },
    {
      id: '9',
      photo:
        'https://th.bing.com/th/id/OIP.3IsXMskZyheEWqtE3Dr7JwHaGe?w=234&h=204&c=7&r=0&o=5&pid=1.7',
    },
  ];
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onClose();
          setImage(item.photo);
        }}
        style={{
          marginHorizontal: 10,
          marginVertical: 10,
          justifyContent: 'center',
        }}>
        <Avatar.Image
          size={60}
          source={{
            uri: item.photo,
          }}
        />
      </TouchableOpacity>
    );
  };
  return (
    <FlatList
      data={listData}
      numColumns={3}
      renderItem={renderItem}
      key={item => item.id}
    />
  );
};

export default ListAvatar;
