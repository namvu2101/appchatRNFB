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
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Avatar, Badge} from 'react-native-paper';
import {COLORS, FONTS, SIZES, images} from '../../constants';
import List_Message from './List_Message';
import {db, storage, timestamp} from '../../firebase/firebaseConfig';
import {authStore, profileStore} from '../../store';
import {firebase} from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import {handlePickImage} from '../../components/ImagePicker';
import Animated from 'react-native-reanimated';

export default function Index({route}) {
  const navigation = useNavigation();
  const [input, setInput] = useState('');
  const [conversation_exists, setConversation_exists] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [messages, setMessages] = useState([]);
  const recipient = route.params.item;
  const recipientId = route.params.recipientId;
  const type = route.params.type;
  const conversation_id = route.params.conversation_id;
  const [conversationData, setConversationData] = useState(recipient);
  const {profile} = profileStore();
  const {userId} = authStore();
  const timeSend = new Date();

  useLayoutEffect(() => {
    fetchConversationData();
    fetchData();
    checkConversation_exists();
  }, [conversation_id]);
  const fetchConversationData = () => {
    db.collection('Conversations')
      .doc(conversation_id)
      .get()
      .then(query => {
        console.log('1');
        if (query.exists) {
          setConversationData(query.data());
        }
      });
  };
  const checkConversation_exists = () => {
    db.collection('Conversations')
      .doc(conversation_id)
      .get()
      .then(doc => {
        setConversation_exists(doc.exists);
        if (
          doc.exists &&
          doc.data().type == 'Person' &&
          doc.data().image != recipient.image
        ) {
          db.collection('Conversations').doc(conversation_id).update({
            image: recipient.image,
          });
        }
      });
  };
  const fetchData = () => {
    const unsubscribe = db
      .collection('Conversations')
      .doc(conversation_id)
      .collection('messages')
      .orderBy('timeSend', 'desc')
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(documentSnapshot => {
          const message = {
            id: documentSnapshot.id,
            data: documentSnapshot.data(),
          };
          data.push(message);
        });
        console.log('layy du lieu ok');
        setMessages(data);
      });

    return () => unsubscribe();
  };

  const onSendMessage = (messageType, imageUri) => {
    const id = uuid.v4();
    const timeSend = new Date();
    const formData = {
      timeSend: timeSend.toString(),
      senderId: userId,
      senderImage: profile.image,
      name: profile.name,
      messageType: messageType === 'image' ? 'image' : 'text',
      messageText: messageType === 'image' ? 'đã gửi hình ảnh' : input,
    };
    if (messageType === 'image') {
      formData.photo = imageUri;
    }
    if (type === 'Person') {
      formData.recipientId = recipientId;
      sendPersonMessages(formData);
      setMessages([{id: id, data: formData}, ...messages]);
    } else {
      sendGroup(formData);
      setMessages([{id: id, data: formData}, ...messages]);
    }
    setInput('');
  };
  const sendPersonMessages = formData => {
    const conversationIds = [
      `${userId}-${recipientId}`,
      `${recipientId}-${userId}`,
    ];

    conversationIds.forEach(conversationId => {
      sendPerson(conversationId, formData);

      if (conversation_exists) {
        db.collection('Conversations').doc(conversationId).update({
          last_message: timeSend.toString(),
          messageText: input,
        });
      } else {
        createConversation(conversationId);
      }
    });
  };

  const sendPerson = (id, data) => {
    db.collection('Conversations').doc(id).collection('messages').add(data);
  };
  const createConversation = id => {
    db.collection('Conversations')
      .doc(id)
      .set({
        type: 'Person',
        last_message: timestamp,
        recipientId: id === `${userId}-${recipientId}` ? recipientId : userId,
        senderID: id === `${userId}-${recipientId}` ? userId : recipientId,
        name: id === `${userId}-${recipientId}` ? recipient.name : profile.name,
        image:
          id === `${userId}-${recipientId}` ? recipient.image : profile.image,
      });
  };

  const sendGroup = async formData => {
    const collectionRef = db
      .collection('Conversations')
      .doc(conversation_id)
      .collection('messages');
    await collectionRef.add(formData);
    await db.collection('Conversations').doc(conversation_id).update({
      last_message: timeSend.toString(),
      messageText: input,
    });
  };
  const sendImage = async () => {
    const id = uuid.v4();
    Keyboard.dismiss();
    try {
      const newImagePath = await handlePickImage();
      if (newImagePath != 'Error') {
        const reference = storage().ref(`Conversations/Files/${id}`);
        await reference.putFile(newImagePath);
        const downloadURL = await reference.getDownloadURL();
        onSendMessage('image', downloadURL);
      }
    } catch (error) {
      console.log('error', error);
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
        });
      },
    },
  ];

  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{marginRight: 10}}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={25}
              color={'#000E08'}
            />
          </Pressable>
          <View
            style={{
              borderColor: 'blue',
              height: 50,
              width: 50,
              borderWidth: 1,
              borderRadius: 27,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Avatar.Image
              size={49}
              source={{uri: conversationData?.image || images.imageLoading}}
            />
            <Badge
              size={15}
              style={{
                position: 'absolute',
                backgroundColor: COLORS.green,
                borderColor: COLORS.white,
                borderWidth: 2,
                bottom: 0,
                right: 0,
              }}
            />
          </View>

          <View style={{width: SIZES.width * 0.33, marginLeft: 12}}>
            <Text
              numberOfLines={1}
              style={{
                ...FONTS.h3,
              }}>
              {conversationData?.name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                ...FONTS.h3,
                color: COLORS.secondaryGray,
              }}>
              online
            </Text>
          </View>
          {list_icon.map(i => (
            <TouchableOpacity onPress={i.onPress} key={i.icon}>
              <Avatar.Icon
                size={40}
                icon={i.icon}
                color={COLORS.primary}
                style={{backgroundColor: '#fff'}}
              />
            </TouchableOpacity>
          ))}
        </View>
        <FlatList
          inverted
          showsVerticalScrollIndicator={false}
          data={messages}
          style={{width: SIZES.width, paddingHorizontal: 10}}
          renderItem={({item}) => (
            <List_Message
              item={item.data}
              id={item.id}
              userId={userId}
              user={recipient}
              conversation_id={conversation_id}
            />
          )}
        />
        <View style={styles._input_box}>
          <MaterialCommunityIcons
            name="paperclip"
            size={25}
            color={'#000E08'}
          />
          <TextInput
            value={input}
            onChangeText={setInput}
            style={{
              ...FONTS.h4,
              width: '70%',
              paddingHorizontal: 5,
              height: 50,
              borderColor: COLORS.primary,
              borderWidth: 2,
              borderRadius: 25,
              paddingLeft: 12,
              marginHorizontal: 10,
            }}
            onSubmitEditing={() => onSendMessage('text')}
          />

          {input.length != 0 ? (
            <TouchableOpacity
              onPress={() => onSendMessage('text')}
              disabled={input.length != 0 ? false : true}>
              <MaterialCommunityIcons
                name="send-circle"
                size={44}
                color={'#20A090'}
              />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={{marginRight: 10}} onPress={sendImage}>
                <MaterialCommunityIcons
                  name="camera-outline"
                  size={25}
                  color={'#000E08'}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <MaterialCommunityIcons
                  name="microphone"
                  size={25}
                  color={'#000E08'}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    width: SIZES.width,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 22,
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
});
