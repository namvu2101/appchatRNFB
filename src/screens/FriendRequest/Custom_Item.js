import {Pressable, StyleSheet, Text, View, Image} from 'react-native';
import React, {useContext} from 'react';
import {COLORS, FONTS, SIZES, images} from '../../constants';
import {Avatar, Button} from 'react-native-paper';
import {db} from '../../firebase/firebaseConfig';
import {firebase} from '@react-native-firebase/firestore';
import {authStore, profileStore} from '../../store';

export default function Custom_Item({item, data, setData}) {
  const {userId} = authStore();
  const handleAccept = () => {
    updateFriends(userId, item.id);
    updateFriends(item.id, userId);
    updateSentRequests(userId, item.id);
    updateRequests(item.id, userId);
    handleReject();
  };

  const handleReject = () => {
    setData(data.filter(i => i.id != item.id));
    updateRequests(userId, item.id);
    updateSentRequests(item.id, userId);
  };

  const updateFriends = (id, data) => {
    db.collection('friends')
      .doc(id)
      .set(
        {
          list_friends: firebase.firestore.FieldValue.arrayUnion(data),
        },
        {merge: true},
      );
  };

  const updateRequests = (id, data) => {
    db.collection('friendRequests')
      .doc(id)
      .set(
        {
          list_friendRequests: firebase.firestore.FieldValue.arrayRemove(data),
        },
        {merge: true},
      );
  };

  const updateSentRequests = (id, data) => {
    db.collection('sentRequestFriends')
      .doc(id)
      .set(
        {
          list_sentRequestFriends:
            firebase.firestore.FieldValue.arrayRemove(data),
        },
        {merge: true},
      );
  };
  return (
    <Pressable
      style={{
        width: SIZES.width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginVertical: 10,
      }}>
      <Avatar.Image source={{uri: item?.image || images.imageLoading}} size={55} />
      <View style={{width: 100, alignItems: 'center'}}>
        <Text style={{...FONTS.h4, color: COLORS.black}} numberOfLines={1}>
          {item?.name}
        </Text>
        <Text
          style={{...FONTS.h4, color: COLORS.secondaryGray}}
          numberOfLines={1}>
          {item?.phone}
        </Text>
      </View>
      <Button mode="outlined" textColor="blue" onPress={() => handleAccept()}>
        Thêm
      </Button>
      <Button
        mode="elevated"
        textColor={COLORS.white}
        onPress={() => handleReject()}>
        Xóa
      </Button>
    </Pressable>
  );
}

const styles = StyleSheet.create({});
