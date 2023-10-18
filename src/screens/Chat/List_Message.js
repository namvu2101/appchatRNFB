import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Avatar, IconButton} from 'react-native-paper';
import {COLORS, SIZES, images} from '../../constants';
import UIModals from '../../components/UIModals';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {db} from '../../firebase/firebaseConfig';
import ImageModals from '../Modals/ImageModals';
import {firebase} from '@react-native-firebase/firestore';

export default function List_Message({
  item,
  userId,
  user,
  conversation_id,
  id,
}) {
  const [isSelected, setisSelected] = React.useState(false);
  const [isVisible, setisVisible] = React.useState(false);
  const [isLongPress, setisLongPress] = React.useState(false);
  const formatTime = time => {
    const options = {hour: 'numeric', minute: 'numeric', hour12: true};
    return new Date(time).toLocaleString('en-US', options);
  };
  const list = [
    {icon: 'arrow-down-thin', onPress: () => {}},
    {icon: 'pin-outline', onPress: () => {}},
    {
      icon: 'delete-outline',
      onPress: () => {
        handleDelete();
      },
    },
  ];
  const handleDelete = () => {
    Alert.alert(
      'Thông báo',
      'Bạn muốn xóa tin nhắn này ?',
      [
        {
          text: 'OK',
          onPress: () => {
            deletleMessage();
          },
        },
        {text: 'Huỷ', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };
  const deletleMessage = () => {
    db.collection('Conversations')
      .doc(conversation_id)
      .collection('messages')
      .doc(id)
      .delete();
  };
  const messageContainerStyle =
    item?.senderId === userId
      ? styles.senderMessageContainer
      : styles.receiverMessageContainer;

  return (
    <View>
      {item?.senderId !== userId && (
        <View style={styles.userInfoContainer}>
          <Avatar.Image
            source={{
              uri:
                user.type === 'Person'
                  ? user.image
                  : item.senderImage || images.imageLoading,
            }}
            size={20}
          />
          <Text style={styles.senderNameText}>{item.name}</Text>
        </View>
      )}
      {item.messageType === 'text' ? (
        <>
          <Pressable
            onPress={() => setisSelected(!isSelected)}
            onLongPress={() => setisLongPress(!isLongPress)}
            style={[styles.messageContainer, messageContainerStyle]}>
            <Text style={styles.messageText}>{item?.messageText}</Text>

            {isSelected && (
              <Text
                style={{
                  ...styles.timestampText,
                  textAlign: item?.senderId === userId ? 'right' : 'left',
                }}>
                {formatTime(item.timeSend)}
              </Text>
            )}
          </Pressable>

          {isLongPress && (
            <View
              style={[
                messageContainerStyle,
                {
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  borderRadius: 20,
                  borderColor: 'green',
                  borderWidth: 1,
                  marginTop: 10,
                  paddingVertical: 5,
                  width: 200,
                  backgroundColor: 'white',
                },
              ]}>
              {list.map(i => (
                <Pressable onPress={i.onPress} key={i.icon}>
                  <Avatar.Icon icon={i.icon} size={33} color="white" />
                </Pressable>
              ))}
            </View>
          )}
        </>
      ) : (
        item.messageType === 'image' && (
          <>
            <Pressable
              onPress={() => setisVisible(true)}
              onLongPress={() => setisLongPress(!isLongPress)}
              style={[messageContainerStyle, styles.imageMessageContainer]}>
              <Image
                source={{
                  uri: item?.photo || images.imageLoading,
                }}
                style={styles.image}
                resizeMode="cover"
              />
              {isLongPress && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    borderRadius: 20,
                    borderColor: 'green',
                    borderWidth: 1,
                    marginTop: 10,
                    paddingVertical: 5,
                    width: 200,
                  }}>
                  {list.map(i => (
                    <Pressable
                      onPress={i.onPress}
                      key={i.icon}
                      style={{justifyContent: 'space-between'}}>
                      <Avatar.Icon icon={i.icon} size={33} color="white" />
                    </Pressable>
                  ))}
                </View>
              )}
            </Pressable>
          </>
        )
      )}

      <UIModals
        isVisible={isVisible}
        onClose={() => setisVisible(false)}
        animationInTiming={100}>
        <ImageModals onClose={() => setisVisible(false)} image={item.photo} />
      </UIModals>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    padding: 8,
    maxWidth: '60%',
    borderRadius: 7,
    margin: 10,
  },
  senderMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  receiverMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
  },
  imageMessageContainer: {
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 15,
    color: '#000',
  },
  timestampText: {
    fontSize: 9,
    color: '#000',
  },
  senderTimestampText: {
    textAlign: 'right',
  },
  receiverTimestampText: {
    textAlign: 'left',
  },
  image: {
    width: 150,
    height: 300,
    borderColor: COLORS.secondaryGray,
    borderWidth: 1,
    borderRadius: 10,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  senderNameText: {
    fontSize: 9,
    color: '#000',
    marginHorizontal: 5,
  },
});
