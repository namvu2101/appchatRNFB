import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect} from 'react';
import {FONTS, COLORS, images, SIZES} from '../../constants';
import {ActivityIndicator, List} from 'react-native-paper';
import {db} from '../../firebase/firebaseConfig';
import {authStore} from '../../store';
import {Avatar} from '@rneui/base/dist/Avatar/Avatar';
import {ListItem} from '@rneui/themed';
import UIBottomSheet from '../../components/UIBottomSheet';

export default function Message_Items({item, index, onPress, conversation_id}) {
  const [chatmessages, setChatMessages] = React.useState([]);
  const [messageText, setMessageText] = React.useState('');
  const [isLoading, setisLoading] = React.useState(false);
  const {userId} = authStore();
  const [isVisible, setIsVisible] = React.useState(false);

  React.useLayoutEffect(() => {
    if (!item.message) {
      setMessageText(`Hãy gửi lời chào đến ${item.name}`);
    } else if (userId == item.message?.id) {
      setMessageText(`Bạn: ${item.message?.messageText}`);
    } else {
      setMessageText(`${item.message?.name}: ${item.message?.messageText}`);
    }
  }, [item?.message]);
  const handleDelete = () => {
    Alert.alert(
      'Thông báo',
      'Bạn muốn xóa đoạn chat này ?',
      [
        {
          text: 'OK',
          onPress: async () => {
            setisLoading(true);
            await removeChat(conversation_id);
            setisLoading(false);
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
  const list = [
    {
      icon: 'delete-off-outline',
      title: 'Xóa',
      onPress: () => {
        handleDelete();
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
    <TouchableOpacity
      onPress={onPress}
      onLongPress={() => setIsVisible(true)}
      style={{paddingHorizontal: 10, width: SIZES.width}}>
      <ListItem
        containerStyle={{
          height: 80,
          backgroundColor: COLORS.secondaryWhite,
          marginVertical: 5,
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.3,
          shadowRadius: 20,
        }}>
        <View
          style={{
            borderColor: 'blue',
            height: 60,
            width: 60,
            borderWidth: 1,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              flex: 1,
              height: 14,
              width: 14,
              borderRadius: 7,
              backgroundColor: item?.isOnline ? COLORS.green : COLORS.gray,
              borderColor: COLORS.white,
              borderWidth: 2,
              position: 'absolute',
              bottom: 0,
              right: 2,
              zIndex: 1000,
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
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
