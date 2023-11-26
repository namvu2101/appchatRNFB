import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
} from 'react-native';
import React, {useEffect} from 'react';
import {FONTS, COLORS, images, SIZES} from '../../constants';
import {ActivityIndicator, List} from 'react-native-paper';
import {db} from '../../firebase/firebaseConfig';
import {authStore} from '../../store';
import {Avatar} from '@rneui/base/dist/Avatar/Avatar';
import {ListItem} from '@rneui/themed';
import UIBottomSheet from '../../components/UIBottomSheet';
import {UserType} from '../../contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '@react-native-firebase/firestore';

export default function Message_Items({item, index, onPress, conversation_id}) {
  const [chatmessages, setChatMessages] = React.useState([]);
  const [messageText, setMessageText] = React.useState('');
  const [isLoading, setisLoading] = React.useState(false);
  const {userId} = authStore();
  const [isVisible, setIsVisible] = React.useState(false);
  const {userConversations, setUserConversations} = React.useContext(UserType);

  React.useLayoutEffect(() => {
    if (!item.message) {
      setMessageText(`Hãy gửi lời chào đến ${item.name}`);
    } else if (userId == item.message?.id) {
      setMessageText(`Bạn: ${item.message?.messageText}`);
    } else {
      setMessageText(`${item.message?.name}: ${item.message?.messageText}`);
    }
  }, [item.message?.messageText]);
  const handleDelete = () => {
    Alert.alert(
      'Thông báo',
      'Bạn muốn xóa đoạn chat này ?',
      [
        {
          text: 'Đồng ý',
          onPress: async () => {
            await removeChat(conversation_id);
            setUserConversations(
              userConversations.filter(i => i.id != conversation_id),
            );
          },
        },
        {text: 'Huỷ', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };
  const removeChat = async id => {
    try {
      db.collection('Conversations').doc(id).delete();

      const messagesRef = db
        .collection('Conversations')
        .doc(id)
        .collection('messages');
      const querySnapshot = await messagesRef.get();
      querySnapshot.forEach(async doc => {
        await doc.ref.delete();
      });
    } catch (error) {
      console.error('Error deleting messages:', error);
    }
  };
  const outConversation = async id => {
    db.collection('Conversations')
      .doc(id)
      .update({
        member_id: firebase.firestore.FieldValue.arrayRemove(`${userId}`),
      });
  };
  const list = [
    {
      icon: 'delete-off-outline',
      title: item.type == 'Person' ? 'Xóa' : 'Rời nhóm',
      onPress: () => {
        if (item.type == 'Person') {
          handleDelete();
        } else {
          Alert.alert(
            'Thông báo',
            'Bạn muốn rời đoạn chat này ?',
            [
              {
                text: 'Đồng ý',
                onPress: async () => {
                  outConversation(conversation_id);
                  setUserConversations(
                    userConversations.filter(i => i.id != conversation_id),
                  );
                },
              },
              {text: 'Huỷ', style: 'cancel'},
            ],
            {cancelable: true},
          );
        }
        setIsVisible(false);
      },
    },
    {
      icon: 'bell-off-outline',
      title: 'Tắt',
      onPress: () => {},
    },
    {
      icon: 'account-group-outline',
      title: 'Tạo nhóm',
      onPress: () => {},
    },
    {
      icon: 'email-remove-outline',
      title: 'Đánh dấu chưa đọc',
      onPress: () => {},
    },
    {
      icon: 'eye-remove-outline',
      title: 'Ẩn',
      onPress: () => {},
    },
    {
      icon: 'block-helper',
      title: 'Chặn',
      onPress: () => {},
    },
  ];
  return (
    <Pressable
      onPress={onPress}
      onLongPress={() => setIsVisible(true)}
      style={{paddingHorizontal: 10, width: SIZES.width}}>
      <ListItem containerStyle={styles._items}>
        <View style={styles._image}>
          <View
            style={{
              ...styles._badge,
              backgroundColor: item?.isOnline ? COLORS.green : COLORS.gray,
            }}
          />

          <Avatar
            rounded
            source={{
              uri: item?.image || images.imageLoading,
            }}
            size={55}
          />
        </View>
        <ListItem.Content>
          <ListItem.Title style={{fontWeight: 'bold'}} numberOfLines={1}>
            {item.name}
          </ListItem.Title>
          <ListItem.Subtitle
            style={{marginTop: 5, color: COLORS.secondaryGray}}
            numberOfLines={1}>
            {messageText}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
      <UIBottomSheet
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        data={list}
        type={item.type}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  _items: {
    height: 80,
    backgroundColor: COLORS.white,
    marginVertical: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  _image: {
    borderColor: 'blue',
    height: 60,
    width: 60,
    borderWidth: 1,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  _badge: {
    flex: 1,
    height: 14,
    width: 14,
    borderRadius: 7,
    borderColor: COLORS.white,
    borderWidth: 2,
    position: 'absolute',
    bottom: 0,
    right: 2,
    zIndex: 1000,
  },
});
