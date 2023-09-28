import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  FlatList,
  Pressable,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Avatar, TextInput} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {db, storage} from '../../firebase/firebaseConfig';
import {firebase} from '@react-native-firebase/firestore';
import List_Message from './List_Message';
import {launchImageLibrary} from 'react-native-image-picker';
import uuid from 'react-native-uuid';
import {screenwidth} from '../conponents/Dimensions';
import {useProfileStore} from '../../Store/profileStore';
export default function Chat_Message({route}) {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState('');
  const [submit, setSubmit] = useState(false);
  const [messages, setMessages] = useState([]);
  const item = route.params;
  const {data} = useProfileStore();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitle: () => (
        <View style={styles.header}>
          <Avatar.Image size={49} source={{uri: item.avatar}} />
          <Text numberOfLines={1} style={styles.title_header}>
            {item.name}
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
          <TouchableOpacity
            onPress={() => navigation.navigate('ChatSettings', item)}>
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

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection('Chats')
      .doc(item.id)
      .collection('messages')
      .orderBy('timestamp', 'desc')
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
  }, [item]);
  useEffect(() => {
    if (inputText == '') {
      setSubmit(false);
    } else setSubmit(true);
  }, [inputText]);

  const onSendMessage = async (messageType, imageUri) => {
    setInputText('');
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const formData = {
      timestamp,
      senderId: data.id,
      avatar: data.avatar,
      name: data.name,
    };

    if (messageType === 'image') {
      formData.messageType = 'image';
      formData.photo = imageUri;
      formData.messageText = 'send photo';
    } else {
      formData.messageType = 'text';
      formData.messageText = inputText;
    }
    if (item.type === 'Person') {
      const chatIds = [
        `${data.id}-${item.reciverID}`,
        `${item.reciverID}-${data.id}`,
      ];

      const updateTimestamps = chatIds.map(chatId => {
        const chatRef = db.collection('Chats').doc(chatId);
        return chatRef.set({
          type: 'Person',
          timestamp,
          senderID:
            chatId === `${data.id}-${item.reciverID}`
              ? data.id
              : item.reciverID,
          name:
            chatId === `${data.id}-${item.reciverID}` ? item.name : data.name,
          avatar:
            chatId === `${data.id}-${item.reciverID}`
              ? item.avatar
              : data.avatar,
          reciverID:
            chatId === `${data.id}-${item.reciverID}`
              ? item.reciverID
              : data.id,
        });
      });

      const sendMessagePromises = chatIds.map(chatId => {
        const messageRef = db
          .collection('Chats')
          .doc(chatId)
          .collection('messages')
          .add(formData);

        return messageRef;
      });

      await Promise.all([...updateTimestamps, ...sendMessagePromises]);
    } else {
      db.collection('Chats').doc(item.id).collection('messages').add(formData);
      db.collection('Chats').doc(item.id).update({
        timestamp,
      });
    }
  };
  const pickImage = async () => {
    const id = uuid.v4();
    const reference = storage().ref(`Chats/${item.id}/Files/${id}`);
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('data cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        try {
          const pathToFile = response.assets[0].uri; // Use 'response.uri' directly
          // Upload the file to Firebase Storage
          reference
            .putFile(pathToFile)
            .then(async () => {
              const downloadURL = await reference.getDownloadURL();
              // Log đường dẫn URL ra console
              console.log('Send image successfully!');
              onSendMessage('image', downloadURL);
            })
            .catch(error => {
              console.error('Error uploading image:', error);
            });
        } catch (error) {
          console.log(error);
        }
      }
    });
  };
  return (
    <View style={styles.container}>
      <FlatList
        inverted
        showsVerticalScrollIndicator={false}
        data={messages}
        renderItem={({item}) => (
          <List_Message item={item.data} userId={data.id} user={route.params} />
        )}
        keyExtractor={item => item.id}
      />
      <View style={styles._input_box}>
        <MaterialCommunityIcons name="paperclip" size={25} color={'#000E08'} />
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          outlineStyle={styles._text_input}
          style={{width: '70%', paddingHorizontal: 5}}
          textColor="#000E08"
          cursorColor="#000E08"
          mode="outlined"
          right={<TextInput.Icon icon="file-outline" color={'#797C7B'} />}
        />
        <View style={styles._btnSend}>
          {submit ? (
            <Pressable onPress={() => onSendMessage('text')}>
              <MaterialCommunityIcons
                name="send-circle"
                size={44}
                color={'#20A090'}
              />
            </Pressable>
          ) : (
            <>
              <Pressable style={{marginRight: 10}} onPress={pickImage}>
                <MaterialCommunityIcons
                  name="camera-outline"
                  size={25}
                  color={'#000E08'}
                />
              </Pressable>
              <Pressable>
                <MaterialCommunityIcons
                  name="microphone"
                  size={25}
                  color={'#000E08'}
                />
              </Pressable>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#2C6BED',
    marginRight: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    color: 'black',
  },
  buttonContainer: {
    backgroundColor: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    paddingHorizontal: 10,
  },
  _btnSend: {
    width: 50,
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  _text_input: {
    borderRadius: 25,
    backgroundColor: '#F3F6F6',
    borderColor: '#F3F6F6',
    marginHorizontal: 10,
  },
  _input_box: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    width: screenwidth,
    justifyContent: 'center',
  },
  header: {
    marginLeft: -20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title_header: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
    marginHorizontal: 10,
    width: 120,
  },
});
