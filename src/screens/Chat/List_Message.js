import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import React from 'react';
import {Avatar, Icon, IconButton} from 'react-native-paper';
import {COLORS, FONTS, SIZES, images} from '../../constants';
import UIModals from '../../components/UIModals';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {db} from '../../firebase/firebaseConfig';
import ImageModals from '../Modals/ImageModals';
import {firebase} from '@react-native-firebase/firestore';
import Video from 'react-native-video';
import {useNavigation} from '@react-navigation/native';
import {BottomSheet, ListItem} from '@rneui/themed';
import {BgColors, LIGHT_COLORS} from '../../constants/colors';
import {downloadFile} from '../../components/DownFile';
export default function List_Message({
  item,
  userId,
  user,
  conversation_id,
  id,
  backgroundColor,
  sendSuccess,
  index,
}) {
  const [isSelected, setisSelected] = React.useState(false);
  const [isVisible, setisVisible] = React.useState(false);
  const [isLongPress, setisLongPress] = React.useState(false);
  const [mediaType, setMediaType] = React.useState('');
  const navigation = useNavigation();
  const formatTime = time => {
    if (time instanceof firebase.firestore.Timestamp) {
      const jsDate = time.toDate();
      const options = {hour: 'numeric', minute: 'numeric'};
      return new Date(jsDate).toLocaleString('en-US', options);
    } else {
      const options = {hour: 'numeric', minute: 'numeric'};
      return new Date(time).toLocaleString('en-US', options);
    }
  };
  const textColor =
    LIGHT_COLORS.find(i => i == backgroundColor) || item?.senderId != userId
      ? 'black'
      : 'white';
  const list = [
    {
      icon: 'share-outline',
      onPress: () => {},
    },

    {
      icon: item.messageType === 'text' ? 'content-copy' : 'arrow-down-thin',
      onPress: () => {
        switch (item.messageType) {
          case 'text':
            setisLongPress(false);
            console.warn('Đã sao chép');
            break;
          case 'image':
            setisLongPress(false);
            downloadFile('.png', item.photo);
            break;
          case 'video':
            setisLongPress(false);
            downloadFile('.mp4', item.photo);
            break;
          default:
            console.warn('Không rõ lệnh thực thi');
            break;
        }
      },
    },
    {
      icon: 'pin-outline',
      onPress: () => {},
    },
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
      ? {
          ...styles.senderMessageContainer,
          backgroundColor: backgroundColor,
          color: textColor,
        }
      : styles.receiverMessageContainer;
  const renderMessageContent = () => {
    const navigateToMediaScreen = (uri, mediaType) => {
      navigation.navigate('MediaScreen', {
        uri,
        mediaType,
      });
    };
    const commonProps = {
      onLongPress: () => setisLongPress(true),
      style: [messageContainerStyle, styles.messageContainer],
    };

    const renderTextMessage = () => (
      <Pressable {...commonProps} onPress={() => setisSelected(!isSelected)}>
        <Text style={{...messageContainerStyle, margin: 8}}>
          {item?.messageText}
        </Text>
        {isSelected && (
          <Text
            style={{
              ...styles.timestampText,
              textAlign: item?.senderId === userId ? 'right' : 'left',
              color: textColor,
              marginHorizontal: 8,
            }}>
            {formatTime(item.timeSend)}
          </Text>
        )}
      </Pressable>
    );

    const renderPhotoMessage = () => (
      <Pressable
        {...commonProps}
        onPress={() => navigateToMediaScreen(item.photo, 'photo')}>
        <Image
          source={{
            uri: item?.photo || images.imageLoading,
          }}
          style={styles.image}
          resizeMode="stretch"
        />
      </Pressable>
    );
    const renderVideoMessage = () => (
      <Pressable
        {...commonProps}
        onPress={() => navigateToMediaScreen(item.photo, 'video')}>
        <Image
          source={require('../../assets/images/video.png')}
          style={styles._video}
          resizeMode="stretch"
        />
      </Pressable>
    );

    const renderDocMessage = () => (
      <ListItem
        containerStyle={[messageContainerStyle, styles._document]}
        onPress={() => downloadFile(item.uri.name, item.uri.fileCopyUri)}
        onLongPress={() => setisSelected(!isSelected)}>
        <Icon
          source={
            item.uri.name.includes('.doc')
              ? 'file-word'
              : item.uri.name.includes('.pdf')
              ? 'file-pdf-box'
              : 'file-download'
          }
          size={30}
          color={textColor}
        />
        <ListItem.Content>
          <ListItem.Title numberOfLines={1} style={{color: textColor}}>
            {item.uri.name}
          </ListItem.Title>
          <ListItem.Subtitle style={{color: textColor}}>
            {item.uri.size > 1048575
              ? `${(item.uri.size / 1000000).toFixed(2)} MB`
              : `${(item.uri.size / 1000).toFixed(1)} KB`}
          </ListItem.Subtitle>
          {isSelected && (
            <Text
              style={{
                ...styles.timestampText,
                textAlign: item?.senderId === userId ? 'right' : 'left',
                color: textColor,
                width: '90%',
              }}>
              {formatTime(item.timeSend)}
            </Text>
          )}
        </ListItem.Content>
      </ListItem>
    );
    const renderCard = () => {
      return (
        <View
          style={{
            alignItems: 'center',
            height: SIZES.height / 2,
            backgroundColor: 'white',
            margin: 22,
            borderRadius: 25,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
          }}>
          <Image
            source={{uri: item.card.image}}
            style={{
              height: '50%',
              width: '100%',
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
            }}
          />

          <Text
            style={{
              ...FONTS.h3,
              fontWeight: 'bold',
              alignSelf: 'flex-start',
              padding: 10,
              width: '100%',
            }}
            numberOfLines={2}>
            {item.card.title}
          </Text>
          <Text
            style={{
              ...FONTS.h4,
              alignSelf: 'flex-start',
              padding: 10,
              width: '100%',
            }}
            numberOfLines={3}>
            {item.card.detail}
          </Text>
        </View>
      );
    };
    switch (item.messageType) {
      case 'text':
        return renderTextMessage();
      case 'image':
        return renderPhotoMessage();
      case 'video':
        return renderVideoMessage();
      case 'doc':
        return renderDocMessage();
      default:
        return renderCard();
    }
  };

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
      {renderMessageContent()}
      {item?.senderId == userId && index == 0 && (
        <View
          style={{
            ...styles._success,
            borderColor: backgroundColor || COLORS.primary,
            backgroundColor: sendSuccess ? backgroundColor : 'white',
          }}>
          {sendSuccess && <Icon source={'check'} size={13} color="#fff" />}
        </View>
      )}

      <UIModals
        isVisible={isVisible}
        onClose={() => setisVisible(false)}
        animationInTiming={100}>
        <ImageModals
          onClose={() => setisVisible(false)}
          uri={item.photo}
          mediaType={mediaType}
        />
      </UIModals>
      <BottomSheet
        containerStyle={{backgroundColor: null}}
        modalProps={{
          animationType: 'slide',
        }}
        isVisible={isLongPress}
        onBackdropPress={() => setisLongPress(false)}>
        <View style={styles._bottomSheet}>
          {list.map(i => (
            <TouchableOpacity onPress={i.onPress} key={i.icon}>
              <Avatar.Icon
                icon={i.icon}
                size={40}
                color="white"
                style={{backgroundColor: backgroundColor}}
              />
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    borderRadius: 7,
    margin: 10,
  },
  senderMessageContainer: {
    alignSelf: 'flex-end',
    fontSize: 16,
  },
  receiverMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    color: '#000',
    fontSize: 16,
  },
  imageMessageContainer: {
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 15,
    color: '#fff',
  },
  timestampText: {
    fontSize: 9,
  },
  senderTimestampText: {
    textAlign: 'right',
  },
  receiverTimestampText: {
    textAlign: 'left',
  },
  image: {
    width: SIZES.width / 2.3,
    height: SIZES.height / 3.2,
    borderRadius: 8,
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
  _video: {
    width: SIZES.width / 2,
    height: SIZES.width / 2,
  },
  _document: {
    width: SIZES.width / 2,
    marginVertical: 10,
    borderRadius: 20,
    padding: 5,
  },
  _success: {
    height: 18,
    width: 18,
    borderRadius: 15,
    borderWidth: 2,
    alignSelf: 'flex-end',
    marginBottom: 5,
    marginTop: -5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  _bottomSheet: {
    height: 66,
    backgroundColor: COLORS.secondaryWhite,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
