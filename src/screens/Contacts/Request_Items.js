import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import {COLORS, FONTS, SIZES, images} from '../../constants';
import {Avatar, Button} from 'react-native-paper';
import {authStore, profileStore} from '../../store';
import {db} from '../../firebase/firebaseConfig';
import {firebase} from '@react-native-firebase/firestore';
export default function Request_Items({item, index}) {
  const [sentrequest, setSentrequest] = useState(false);
  const {sentRequestFriends} = profileStore();
  const {userId} = authStore();
  useLayoutEffect(() => {
    if (sentRequestFriends.find(i => i == item.id)) {
      setSentrequest(true);
    }
  }, []);
  const updateSentRequest = (id, data, action) => {
    const docRef = db.doc(`sentRequestFriends/${id}`);
    if (action == 'add') {
      docRef.set(
        {
          list_sentRequestFriends:
            firebase.firestore.FieldValue.arrayUnion(data),
        },
        {merge: true},
      );
    } else {
      docRef.set(
        {
          list_sentRequestFriends:
            firebase.firestore.FieldValue.arrayRemove(data),
        },
        {merge: true},
      );
    }
  };
  const updateFriendRequest = (id, data, action) => {
    const docRef = db.doc(`friendRequests/${id}`);

    if (action == 'add') {
      docRef.set(
        {
          list_friendRequests: firebase.firestore.FieldValue.arrayUnion(data),
        },
        {merge: true},
      );
    } else {
      docRef.set(
        {
          list_friendRequests: firebase.firestore.FieldValue.arrayRemove(data),
        },
        {merge: true},
      );
    }
  };

  const handleSent = () => {
    updateSentRequest(userId, item.id, 'add');
    updateFriendRequest(item.id, userId, 'add');
  };
  const handleCancel = () => {
    updateSentRequest(userId, item.id, 'remove');
    updateFriendRequest(item.id, userId, 'remove');
  };
  const handleSubmit = () => {
    if (sentrequest) {
      handleCancel();
    } else {
      handleSent();
    }
  };
  return (
    <TouchableOpacity
      key={index}
      onPress={() => {}}
      style={[
        {
          width: SIZES.width,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 22,
          borderBottomColor: COLORS.secondaryWhite,
          borderBottomWidth: 1,
          justifyContent: 'space-between',
          height: 60,
          marginVertical: 5,
        },
        index % 2 !== 0
          ? {
              backgroundColor: COLORS.tertiaryWhite,
            }
          : null,
      ]}>
      <Avatar.Image source={{uri: item?.image || images.imageLoading}} size={50} />
      <View>
        <Text
          style={{
            ...FONTS.h4,
            marginBottom: 4,
            color: COLORS.black,
            textAlign: 'center',
          }}>
          {item.name}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: COLORS.secondaryGray,
            textAlign: 'center',
          }}>
          {item.phone}
        </Text>
      </View>
      <Button
        style={{width: 80}}
        mode="outlined"
        textColor={sentrequest ? 'white' : 'blue'}
        buttonColor={sentrequest ? 'blue' : 'white'}
        onPress={() => {
          setSentrequest(!sentrequest);
          handleSubmit();
        }}>
        {sentrequest ? 'Hủy' : 'Gửi'}
      </Button>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
