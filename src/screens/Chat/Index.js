import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Pressable,
  TextInput,
  Keyboard,
  Alert,
} from 'react-native';
import React, {useLayoutEffect, useState, useEffect, useContext} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Avatar, Badge, Icon} from 'react-native-paper';
import {COLORS, FONTS, SIZES, images} from '../../constants';
import List_Message from './List_Message';
import {db, storage, timestamp} from '../../firebase/firebaseConfig';
import {authStore, messagesStore, profileStore} from '../../store';
import uuid from 'react-native-uuid';
import {handlePickImage} from '../../components/ImagePicker';
import {formatTime} from '../../components/Time_off';
import {UserType} from '../../contexts/UserContext';
import {getConversationMessages} from './FetchData';
import {ListItem} from '@rneui/themed';
import {pickDocument} from '../../components/DocumentPicker';
import {sendGroup, sendPerson, updateConversation} from './actions';
export default function Index({route}) {
  const navigation = useNavigation();
  const [input, setInput] = useState('');
  const {users} = useContext(UserType);
  const [conversation_exists, setConversation_exists] = useState(false);
  const {list_messages} = messagesStore();
  const [messages, setMessages] = useState([]);
  const recipient = route.params.item;
  const recipientId = route.params.recipientId;
  const type = route.params.type;
  const conversation_id = route.params.conversation_id;
  const [conversationData, setConversationData] = useState(recipient);
  const {profile} = profileStore();
  const {userId} = authStore();
  const [sendSuccess, setSendSuccess] = useState(true);
  useLayoutEffect(() => {
    checkConversation_exists();
    getConversationMessages(conversation_id, data => {
      setMessages(data);
    });
  }, []);

  const checkConversation_exists = async () => {
    db.collection('Conversations')
      .doc(conversation_id)
      .get()
      .then(doc => {
        if (doc.exists) {
          setConversation_exists(true);
          setConversationData(doc.data());
          if (doc.data().type == 'Person') {
            const res = users.find(i => i.id == recipientId);
            if (doc.data().last_active_at != res.data.last_active_at) {
              db.collection('Conversations').doc(conversation_id).update({
                isOnline: res.data.isOnline,
                last_active_at: res.data.last_active_at,
              });
            } else if (doc.data().image != res.data.image) {
              db.collection('Conversations').doc(conversation_id).update({
                image: recipient.image,
              });
            }
          }
        }
      });
  };

  const onSendMessage = async (Type, url) => {
    setSendSuccess(false);
    const id = uuid.v4();
    let messageType = '';
    let messageText = '';

    switch (Type) {
      case 'image':
        messageType = 'image';
        messageText = 'đã gửi hình ảnh';
        photo = url;
        uri = '';
        break;
      case 'video':
        messageType = 'video';
        messageText = 'đã gửi video';
        photo = url;
        uri = '';
        break;
      case 'text':
        messageType = 'text';
        messageText = input;
        photo = '';
        uri = '';
        break;
      default:
        messageType = 'doc';
        messageText = 'đã gửi tệp';
        photo = '';
        uri = url;
        break;
    }
    const formData = {
      timeSend: new Date(),
      senderId: userId,
      senderImage: profile.image,
      name: profile.name,
      messageType,
      messageText: (messageType = 'text' && input),
      recipientId: type === 'Person' && recipientId,
      photo,
      uri,
    };
    if (messageType === 'text' || 'doc') {
      setMessages([{id: id, data: formData}, ...messages]);
    }
    await checkMessage(type, formData, messageText);
    setInput('');
  };
  const checkMessage = async (type, formData, messageText) => {
    switch (type) {
      case 'Person':
        await sendPersonMessages(formData, messageText);
        break;
      default:
        sendGroup(formData, messageText, conversation_id, profile.name, userId);
        setSendSuccess(true);
        break;
    }
  };
  const sendPersonMessages = async (formData, messageText) => {
    setSendSuccess(false);
    const conversationIds = [
      `${userId}-${recipientId}`,
      `${recipientId}-${userId}`,
    ];
    conversationIds.forEach(conversationId => {
      try {
        if (conversation_exists) {
          updateConversation(conversationId, messageText, profile.name, userId);
        } else {
          createConversation(conversationId, messageText);
        }
        sendPerson(conversationId, formData);
        setSendSuccess(true);
      } catch (error) {
        console.error(error);
      }
    });
  };

  const createConversation = (id, messageText) => {
    db.collection('Conversations')
      .doc(id)
      .set({
        type: 'Person',
        isOnline:
          id === `${userId}-${recipientId}` ? recipient?.isOnline : true,
        last_message: timestamp,
        recipientId: id === `${userId}-${recipientId}` ? recipientId : userId,
        senderID: id === `${userId}-${recipientId}` ? userId : recipientId,
        name: id === `${userId}-${recipientId}` ? recipient.name : profile.name,
        image:
          id === `${userId}-${recipientId}` ? recipient.image : profile.image,
        last_active_at:
          id === `${userId}-${recipientId}`
            ? recipient?.last_active_at
            : timestamp,
        message: {
          messageText,
          name:
            id === `${userId}-${recipientId}` ? profile.name : recipient.name,
          id: id === `${userId}-${recipientId}` ? userId : recipientId,
        },
      });
  };

  // const sendGroup = async (formData, type, messageText) => {
  //   try {
  //     const collectionRef = db
  //       .collection('Conversations')
  //       .doc(conversation_id)
  //       .collection('messages');

  //     await db
  //       .collection('Conversations')
  //       .doc(conversation_id)
  //       .update({
  //         last_message: timestamp,
  //         message: {
  //           messageText,
  //           name: profile.name,
  //           id: userId,
  //         },
  //       });

  //     await collectionRef.add(formData);

  //     setSendSuccess(true);
  //   } catch (error) {
  //     console.error('Gửi không thành công', error);
  //   }
  // };
  const sendImage = async () => {
    setSendSuccess(false);
    Keyboard.dismiss();
    try {
      const newImagePath = await handlePickImage('message');
      if (newImagePath != 'Error') {
        const mediaType = newImagePath.type === 'video/mp4' ? 'video' : 'image';
        sendPhotoBackgroud(mediaType, newImagePath.uri);
        const reference = storage().ref(
          `Conversations/Files/${newImagePath.fileName}`,
        );
        await reference.putFile(newImagePath.uri);
        const downloadURL = await reference.getDownloadURL();
        if (downloadURL != true || false) {
          await onSendMessage(mediaType, downloadURL);
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  const sendPhotoBackgroud = (mediaType, image) => {
    const formData = {
      timeSend: new Date(),
      senderId: userId,
      senderImage: profile.image,
      name: profile.name,
      messageType: mediaType === 'image' ? 'image' : 'video',
      messageText: mediaType === 'image' ? 'đã gửi hình ảnh' : 'đã gửi video',
      photo: image,
    };
    setMessages(prevMessages => [{id: image, data: formData}, ...prevMessages]);
  };

  const sendDocument = async () => {
    setSendSuccess(false);
    const newDoc = await pickDocument();
    if (newDoc != 'Error') {
      const reference = storage().ref(`Conversations/Documents/${newDoc.name}`);
      await reference.putFile(newDoc.fileCopyUri);
      const downLoadUrl = await reference.getDownloadURL();

      if (newDoc.type.includes('image')) {
        sendPhotoBackgroud('image', newDoc.fileCopyUri);
        await onSendMessage('image', downLoadUrl);
      } else if (newDoc.type.includes('video')) {
        sendPhotoBackgroud('video', newDoc.fileCopyUri);
        await onSendMessage('video', downLoadUrl);
      } else {
        newDoc.fileCopyUri = downLoadUrl;
        await onSendMessage('doc', newDoc);
      }
    }
  };
  const list_icon = [
    {
      icon: 'video',
      onPress: () => {
        Alert.alert(
          'Thông báo',
          'Chức năng tạm thời chưa hoạt động',
          [
            {
              text: 'OK',
            },
          ],
          {
            cancelable: true,
          },
        );
      },
    },
    {
      icon: 'phone',
      onPress: () => {
        Alert.alert(
          'Thông báo',
          'Chức năng tạm thời chưa hoạt động',
          [
            {
              text: 'OK',
            },
          ],
          {
            cancelable: true,
          },
        );
      },
    },
    {
      icon: 'information',
      onPress: () => {
        navigation.navigate('ChatSettings', {
          item: recipient,
          id: conversation_id,
          backgroundColor: conversationData?.bgColor || COLORS.primary,
        });
      },
    },
  ];

  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <ListItem bottomDivider containerStyle={styles.header}>
          <Pressable onPress={() => navigation.replace('BottomTabs')}>
            <Icon source={'arrow-left'} size={25} color="#000000" />
          </Pressable>

          <View style={styles.avatar}>
            <Avatar.Image
              size={50}
              source={{uri: conversationData?.image || images.imageLoading}}
            />
            <Badge
              size={15}
              style={{
                ...styles._badge,
                backgroundColor: recipient?.isOnline
                  ? COLORS.green
                  : COLORS.gray,
              }}
            />
          </View>
          <ListItem.Content>
            <ListItem.Title numberOfLines={1} style={{fontWeight: 'bold'}}>
              {conversationData?.name}
            </ListItem.Title>
            <ListItem.Subtitle
              style={{color: recipient?.isOnline ? 'red' : 'black'}}>
              {recipient?.isOnline
                ? 'Đang hoạt động'
                : `${formatTime(recipient?.last_active_at)}`}
            </ListItem.Subtitle>
          </ListItem.Content>
          {type === 'Service' ? (
            <Pressable
              onPress={() => {
                navigation.navigate('ChatSettings', {
                  item: recipient,
                  id: conversation_id,
                });
              }}>
              <Icon source={'text-long'} size={30} color={'#000'} />
            </Pressable>
          ) : (
            <View style={{flexDirection: 'row'}}>
              {list_icon.map(i => (
                <TouchableOpacity
                  onPress={i.onPress}
                  key={i.icon}
                  style={{marginRight: 10}}>
                  <Icon
                    source={i.icon}
                    size={25}
                    color={conversationData?.bgColor || COLORS.primary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ListItem>
        <FlatList
          inverted
          showsVerticalScrollIndicator={false}
          data={messages}
          style={{width: SIZES.width, paddingHorizontal: 10}}
          renderItem={({item, index}) => (
            <List_Message
              index={index}
              sendSuccess={sendSuccess}
              item={item.data}
              id={item.id}
              userId={userId}
              user={recipient}
              conversation_id={conversation_id}
              backgroundColor={conversationData?.bgColor || COLORS.primary}
            />
          )}
        />

        <View style={styles._input_box}>
          <TouchableOpacity onPress={sendDocument}>
            <Icon
              source="paperclip"
              size={25}
              color={conversationData?.bgColor || COLORS.primary}
            />
          </TouchableOpacity>
          <TextInput
            value={input}
            onChangeText={setInput}
            style={styles._input}
            onSubmitEditing={() => onSendMessage('text')}
          />

          {input.length != 0 ? (
            <TouchableOpacity
              onPress={() => onSendMessage('text')}
              disabled={input.length != 0 ? false : true}>
              <MaterialCommunityIcons
                name="send-circle"
                size={44}
                color={conversationData?.bgColor || COLORS.primary}
              />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={{marginRight: 10}} onPress={sendImage}>
                <MaterialCommunityIcons
                  name="camera-outline"
                  size={25}
                  color={conversationData?.bgColor || COLORS.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <MaterialCommunityIcons
                  name="microphone"
                  size={25}
                  color={conversationData?.bgColor || COLORS.primary}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </PageContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderColor: 'blue',
    height: 54,
    width: 54,
    borderWidth: 1,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
  },
  _badge: {
    position: 'absolute',

    borderColor: COLORS.white,
    borderWidth: 2,
    bottom: 0,
    right: 0,
  },
  header: {
    width: SIZES.width,
    height: 70,
  },
  _input_box: {
    height: 66,
    flexDirection: 'row',
    alignItems: 'center',
    width: SIZES.width,
    paddingHorizontal: 20,
    borderTopColor: COLORS.secondaryWhite,
    borderTopWidth: 1,
  },
  _btnSend: {
    width: 50,
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  _input: {
    ...FONTS.h4,
    width: '70%',
    paddingHorizontal: 5,
    height: 50,
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 25,
    paddingHorizontal: 12,
    marginHorizontal: 10,
  },
});
