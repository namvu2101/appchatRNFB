import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Avatar, Button, TextInput} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS, SIZES, images} from '../../constants';
import {getInitialItems, getGroupItems, getIconItems} from './SettingItems';
import {handlePickImage} from '../../components/ImagePicker';
import {db, storage} from '../../firebase/firebaseConfig';
import UIModals from '../../components/UIModals';
import uuid from 'react-native-uuid';
import Setting_modals from './Setting_modals';
import Loading from '../../components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {firebase} from '@react-native-firebase/firestore';
import {UserType} from '../../contexts/UserContext';

export default function ChatSettings({route}) {
  const navigation = useNavigation();
  const item = route.params.item;
  const [isNotify, setIsNotify] = useState(true);
  const conversation_id = route.params.id;
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [type, setType] = useState('');
  const [data, setData] = useState(item);
  const listItems = getInitialItems(item.type);
  const listIcon = getIconItems(item.type, isNotify);
  const docRef = db.collection('Conversations').doc(conversation_id);
  const {userConversations, setUserConversations} = React.useContext(UserType);
  useLayoutEffect(() => {
    docRef.onSnapshot(doc => {
      if (doc.exists) {
        setData(doc.data());
      }
    });
  }, [conversation_id]);
  const handleItemClick = async action => {
    switch (action) {
      case 'Đổi tên nhóm':
        console.log('Đổi tên');
        onOpen(action);
        break;
      case 'Thành viên':
        console.log('Thành viên');
        onOpen(action);
        break;
      case 'Đổi ảnh nhóm':
        console.log(' Đổi ảnh nhóm');
        ChangeImage(docRef);
        break;
      case 'Background':
        onOpen(action);
        break;
      case 'Biệt danh':
        onOpen(action);
        break;
      case 'Biểu cảm':
        onOpen(action);
        break;
      case 'Tìm kiếm trong đoạn chat':
        console.log('Tìm kiếm trong đoạn chat');
        onOpen(action);
        break;
      case 'Files':
        console.log('Files');
        onOpen(action);
        break;
      case 'Ẩn đoạn chat':
        hideConversation(conversation_id);
        setUserConversations(
          userConversations.filter(i => i.id != conversation_id),
        );
        navigation.replace('BottomTabs');
        break;
      case 'Rời nhóm':
        Alert.alert(
          'Thông báo',
          'Bạn muốn rời đoạn chat này ?',
          [
            {
              text: 'OK',
              onPress: async () => {
                setisLoading(true);
                outConversation(conversation_id);
                setUserConversations(
                  userConversations.filter(i => i.id != conversation_id),
                );
                navigation.replace('BottomTabs');
                setisLoading(false);
              },
            },
            {text: 'Huỷ', style: 'cancel'},
          ],
          {cancelable: true},
        );
        break;
      case 'Xóa đoạn chat':
        handleDelete();
        setUserConversations(
          userConversations.filter(i => i.id != conversation_id),
        );
        break;
      default:
        break;
    }
  };
  const handleIconClick = index => {
    switch (index) {
      case 0:
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
        break;
      case 1:
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
        break;
      case 2:
        if (data.type == 'Person') {
          navigation.navigate('Information', {
            id: item.recipientId,
          });
        } else {
          onOpen('add_member');
        }
        break;
      case 3:
        setIsNotify(!isNotify);
        break;

      default:
        break;
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({});
  }, []);

  const onClose = () => {
    setIsVisible(false);
    Keyboard.dismiss();
  };

  const onOpen = action => {
    setType(action);
    setIsVisible(true);
  };

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

  const ChangeImage = async doc => {
    try {
      const id = uuid.v4();
      const newImage = await handlePickImage();
      if (newImage != 'Error') {
        setisLoading(true);
        const reference = storage().ref(`Conversations/${doc.id}/Avatar/${id}`);
        await reference.putFile(newImage);
        const downloadURL = await reference.getDownloadURL();
        await doc
          .update({image: downloadURL})
          .then(() => console.log('update success'));
        setisLoading(false);
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.items}
        onPressOut={() => handleItemClick(item.title)}>
        <Text style={{...FONTS.h4}}>{item.title}</Text>
        {item.icon && (
          <MaterialCommunityIcons name={item.icon} size={30} color={'#000'} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <View style={{alignItems: 'center'}}>
          <Avatar.Image
            source={{
              uri: data?.image || images.imageLoading,
            }}
            size={88}
          />
          <Text
            style={{
              ...FONTS.h1,
              fontWeight: 'bold',
              marginVertical: 10,
            }}>
            {data?.name}
          </Text>
          <View style={styles.iconBox}>
            {listIcon.map((item, index) => (
              <Pressable
                onPress={() => handleIconClick(index)}
                key={item.icon}
                style={{alignItems: 'center'}}>
                <Avatar.Icon
                  icon={item.icon}
                  size={40}
                  color={item.color}
                  style={{backgroundColor: COLORS.secondaryWhite}}
                />
                <Text style={{...FONTS.h4, textAlign: 'center'}}>
                  {item.title}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        <FlatList
          data={listItems}
          style={{
            flex: 1,
            marginVertical: 15,
            width: SIZES.width,
            paddingHorizontal: 22,
          }}
          renderItem={renderItem}
        />
        <UIModals isVisible={isVisible} onClose={onClose}>
          <Setting_modals
            isVisible={isVisible}
            onClose={onClose}
            type={type}
            docRef={docRef}
            item={data}
            conversation_id={conversation_id}
          />
        </UIModals>
        <Loading isVisible={isLoading} />
      </PageContainer>
    </SafeAreaView>
  );
}
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
const hideConversation = async conversation_id => {
  db.collection('Conversations').doc(conversation_id).delete();
};
const outConversation = async id => {
  const userId = await AsyncStorage.getItem('userId');

  db.collection('Conversations')
    .doc(id)
    .update({
      member_id: firebase.firestore.FieldValue.arrayRemove(`${userId}`),
    });
};
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000000'},

  items: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: COLORS.secondaryWhite,
    borderBottomWidth: 1,
  },
  iconBox: {
    flexDirection: 'row',
    width: SIZES.width,
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
});
