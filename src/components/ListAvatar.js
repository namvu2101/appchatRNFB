import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React from 'react';
import {profileStore} from '../store';

const ListAvatar = ({setImage, onClose, data, docRef, type, setLoading}) => {
  const {profile} = profileStore();
  const updateImage = async item => {
    if (type === 'avatar') {
      profile.image = item;
      await docRef
        .update({image: item})
        .then(() =>
          Alert.alert('Thông báo !', 'Cập nhật ảnh đại diện thành công'),
        );
    } else {
      profile.backgroundImage = item;
      await docRef
        .update({backgroundImage: item})
        .then(() => Alert.alert('Thông báo !', 'Cập nhật ảnh bìa thành công'));
    }
    setLoading(false);
  };
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onClose();
          setImage(item);
          setLoading(true);
          updateImage(item);
        }}>
        <Image
          source={{uri: item}}
          style={{height: 80, width: 60, margin: 5, borderRadius: 8}}
        />
      </TouchableOpacity>
    );
  };
  return (
    <FlatList
      data={data}
      numColumns={3}
      renderItem={renderItem}
      key={item => item}
    />
  );
};

export default ListAvatar;
