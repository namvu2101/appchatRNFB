import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import React, {useLayoutEffect, useState, useEffect, useContext} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Avatar, TextInput} from 'react-native-paper';
import {FONTS, SIZES, images} from '../../constants';
import UITextInput from '../../components/UITextInput';
import List_Message from './List_Message';
import {db, timestamp} from '../../firebase/firebaseConfig';
import {authStore, profileStore} from '../../store';
import {firebase} from '@react-native-firebase/firestore';
import {UserType} from '../../../UserContext';

export default function Index({route}) {
  const navigation = useNavigation();
  const [input, setInput] = useState('');
  const {setUserConversation, userConversation} = useContext(UserType);
  const [conversation_exists, setConversation_exists] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [messages, setMessages] = useState([]);
  const recipient = route.params.item;
  const type = route.params.type;
  const {profile} = profileStore();
  const {userId} = authStore();
  useEffect(() => {
    if (input.length > 0) {
      setSubmit(true);
    } else {
      setSubmit(false);
    }
  }, [input]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: true,
      headerTitleAlign: 'left',
      headerTitle: () => (
        <View style={styles.header}>
          <Avatar.Image size={49} source={{uri: recipient.image}} />
          <Text numberOfLines={1} style={{...FONTS.h3, marginHorizontal: 10}}>
            {recipient.name}
          </Text>
        </View>
      ),
      headerRight: () => (
        <View style={{flexDirection: 'row', marginRight: -20}}>
          <TouchableOpacity onPress={() => alert('video call')}>
            <Avatar.Icon
              size={40}
              icon="video"
              style={{backgroundColor: '#fff'}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('call')}>
            <Avatar.Icon
              size={40}
              icon="phone"
              style={{backgroundColor: '#fff'}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ChatSettings')}>
            <Avatar.Icon
              size={40}
              icon="information"
              style={{backgroundColor: '#fff'}}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [route]);
  useEffect(() => {
    const conversation_id = `${userId}-${recipient.id}`;
    db.collection('Conversations')
      .doc(conversation_id)
      .get()
      .then(doc => {
        setConversation_exists(doc.exists);

        if (doc.exists && doc.data().avatar != recipient.image) {
          db.collection('Conversations').doc(conversation_id).update({
            avatar: recipient.image,
          });
        }
      });
  }, []);
  useLayoutEffect(() => {
    const conversation_id = `${userId}-${recipient.id}`;
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

        setMessages(data);
      });

    return () => unsubscribe();
  }, []);
  const checkConversation = id => {
    const check = userConversation.find(id => id == item.id);
    const copylist = [...userConversation];
    if (!check) {
      copylist.push(id);
      setUserConversation(copylist);
    }
  };
  const onSendMessage = async (messageType, imageUri) => {
    setInput('');
    const formData = {
      timeSend: timestamp,
      senderId: userId,
      recipientId: recipient.id,
      senderImage: profile.image,
      name: profile.name,
      messageType: messageType === 'image' ? 'image' : 'text',
      messageText: messageType === 'image' ? 'send photo' : input,
    };

    if (type === 'Person') {
      const conversationIds = [
        `${userId}-${recipient.id}`,
        `${recipient.id}-${userId}`,
      ];
      conversationIds.forEach(conversationId => {
        updateUserConversation(conversationId);
        sendPerson(conversationId, formData);
        if (conversation_exists) {
          db.collection('Conversations')
            .doc(conversationId)
            .update({
              last_message: timestamp,
              messageText: messageType === 'image' ? 'send photo' : input,
            });
        } else {
          updateConversation(conversationId);
        }
      });
    } else {
      const collectionRef = db
        .collection('Conversations')
        .doc(item.id)
        .collection('messages');
      await collectionRef.add(formData);
      await db
        .collection('Conversations')
        .doc(item.id)
        .update({
          last_message: timestamp,
          messageText: messageType === 'image' ? 'send photo' : input,
        });
    }
  };

  const sendPerson = (id, data) => {
    db.collection('Conversations').doc(id).collection('messages').add(data);
  };

  const updateConversation = id => {
    db.collection('Conversations')
      .doc(id)
      .set({
        type: 'Person',
        last_message: timestamp,
        messageText: input,
        senderID: id === `${userId}-${recipient.id}` ? userId : recipient.id,
        name:
          id === `${userId}-${recipient.id}` ? recipient.name : profile.name,
        avatar:
          id === `${userId}-${recipient.id}` ? recipient.image : profile.image,
      });
  };

  const updateUserConversation = id => {
    const user = id === `${userId}-${recipient.id}` ? userId : recipient.id;
    db.collection('conversations')
      .doc(user)
      .update({
        list_conversations: firebase.firestore.FieldValue.arrayUnion(id),
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <FlatList
          inverted
          showsVerticalScrollIndicator={false}
          data={messages}
          style={{width: SIZES.width, paddingHorizontal: 10}}
          renderItem={({item}) => (
            <List_Message item={item.data} userId={userId} user={recipient} />
          )}
        />
        <View style={styles._input_box}>
          <MaterialCommunityIcons
            name="paperclip"
            size={25}
            color={'#000E08'}
          />
          <UITextInput
            value={input}
            onChangeText={setInput}
            outlineStyle={styles._text_input}
            style={{width: '70%', paddingHorizontal: 5, height: 50}}
            outlinestyle={{borderRadius: 50}}
            mode="outlined"
            right={<TextInput.Icon icon="file-outline" color={'#797C7B'} />}
          />
          <View style={styles._btnSend}>
            {submit ? (
              <TouchableOpacity onPress={() => onSendMessage('text')}>
                <MaterialCommunityIcons
                  name="send-circle"
                  size={44}
                  color={'#20A090'}
                />
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={{marginRight: 10}}>
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
        </View>
      </PageContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginLeft: -20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  _input_box: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    width: SIZES.width,
    justifyContent: 'center',
  },
  _btnSend: {
    width: 50,
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 10,
  },
});
