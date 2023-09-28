import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Avatar, TextInput} from 'react-native-paper';
import Modal_Actions from './Modal_actions';
import {handlePickImage} from '../../components/ImagePicker';
import uuid from 'react-native-uuid';
import {SIZES} from '../../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import {useNavigation} from '@react-navigation/native';
export default function ChatSettings({route}) {
  const navigation = useNavigation();
  const item = route.params;
  const [name, setName] = useState();
  const [avatar, setAvatar] = useState();
  const [isNotify, setIsNotify] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [type, setType] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
     
    });
  }, []);

  const list_icon = [
    {icon: 'phone', color: '#FFF', title: 'Call', onPress: () => {}},
    {icon: 'video', color: '#FFF', title: 'Video Call', onPress: () => {}},
    // {
    //   icon: item.type === 'Group' ? 'account-plus' : 'account',
    //   color: '#FFF',
    //   title: item.type === 'Group' ? 'Add' : 'Profile',
    //   onPress: () => {},
    // },
    {
      icon: isNotify ? 'bell' : 'bell-off',
      color: isNotify ? '#FFF' : '#3777F0',
      title: 'Off',
      onPress: () => {
        setIsNotify(!isNotify);
      },
    },
  ];
  const list_items = [
    {icon: 'pencil', color: '#000', title: 'Background', onPress: () => {}},
    {
      icon: 'emoticon-cool-outline',
      color: '#000',
      title: 'Icon',
      onPress: () => {},
    },
    {
      icon: 'magnify',
      color: '#000',
      title: 'Sreach Message',
      onPress: () => {},
    },
    {
      icon: 'file-image',
      color: '#000',
      title: 'File',
      onPress: () => {},
    },
    {
      icon: 'eye-off',
      color: '#000',
      title: 'Hide',
      onPress: () => {},
    },
  ];
  const onClose = () => {
    setIsVisible(false);
  };
  const onOpen = actions => {
    setType(actions);
    setIsVisible(true);
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <View style={{alignItems: 'center'}}>
          <Avatar.Image
            source={{
              uri:
                avatar ||
                'https://th.bing.com/th/id/OIP.m5IPjbtP__xtoz0TK6DRjQHaHa?w=211&h=211&c=7&r=0&o=5&pid=1.7',
            }}
            size={88}
          />
          <Text
            style={{
              color: '#fff',
              fontSize: 20,
              fontWeight: '700',
              marginVertical: 10,
            }}>
            Name
          </Text>
          <View style={styles._icon_box}>
            {list_icon.map(item => (
              <Pressable
                onPress={item.onPress}
                key={item.icon}
                style={{flex: 1, alignItems: 'center'}}>
                <Avatar.Icon
                  icon={item.icon}
                  size={40}
                  color={item.color}
                  style={{backgroundColor: '#051D13'}}
                />
                <Text style={{color: '#FFF'}}>{item.title}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.body}>
          <Text style={{color: '#C0C0C0'}}>Customs</Text>
          {list_items.map(item => (
            <TouchableOpacity
              key={item.title}
              style={styles.items}
              onPressOut={item.onPress}>
              <Text style={{color: '#000'}}>{item.title}</Text>
              <MaterialCommunityIcons
                name={item.icon}
                size={30}
                color={'#000'}
              />
            </TouchableOpacity>
          ))}
          {/* <>
         {item.type === 'Group' ? (
           <View>
             <Text style={{color: '#C0C0C0'}}>Group Information</Text>
             <TouchableOpacity
               style={styles.items}
               onPress={() => onOpen('Members')}>
               <Text style={{color: '#000'}}>Members</Text>
               <MaterialCommunityIcons
                 name="account-group"
                 size={30}
                 color={'#000'}
               />
             </TouchableOpacity>
             <TouchableOpacity
               style={styles.items}
               onPress={async () => {
                 await handlePickImage(setAvatar);
                 handleUpdate(item.id, avatar);
               }}>
               <Text style={{color: '#000'}}>Change Group Avatar</Text>
               <MaterialCommunityIcons name="pencil" size={30} color={'red'} />
             </TouchableOpacity>
             <TouchableOpacity
               style={styles.items}
               onPress={() => onOpen('ChangeName')}>
               <Text style={{color: '#000'}}>Change Group Name</Text>
               <MaterialCommunityIcons name="pencil" size={30} color={'red'} />
             </TouchableOpacity>
             <TouchableOpacity
               onPress={() => {
                 handleDelete(item.id);
                 navigation.replace('Tabs');
               }}
               style={styles.items}>
               <Text style={{color: '#000'}}>Delete</Text>
               <MaterialCommunityIcons name="delete" size={30} color={'red'} />
             </TouchableOpacity>
           </View>
         ) : (
           <View>
             <TouchableOpacity
               onPress={() => {
                 handleDelete(item.id, navigation);
               }}
               style={styles.items}>
               <Text style={{color: '#000'}}>Delete</Text>
               <MaterialCommunityIcons name="delete" size={30} color={'red'} />
             </TouchableOpacity>
           </View>
         )}
       </> */}
        </View>

        <Modal_Actions isVisible={isVisible} onClose={onClose} type={type} />
      </PageContainer>
    </SafeAreaView>
  );
}

const handleDelete = (id, navigation) => {
  // Alert.alert(
  //   'Message',
  //   'Do you want delete this Message?',
  //   [
  //     {
  //       text: 'Ok',
  //       onPress: () => {
  //         removeChat(id);
  //         navigation.replace('Tabs');
  //       },
  //     },
  //     {
  //       text: 'Cancel',
  //     },
  //   ],
  //   {cancelable: true},
  // );
};

const removeChat = async id => {
  // try {
  //   db.collection('Chats').doc(id).delete();
  //   const messagesRef = db.collection('Chats').doc(id).collection('messages');
  //   const querySnapshot = await messagesRef.get();
  //   querySnapshot.forEach(async doc => {
  //     await doc.ref.delete();
  //   });
  // } catch (error) {
  //   console.error('Error deleting messages:', error);
  //   Alert.alert(
  //     'Error',
  //     'An error occurred while deleting messages',
  //     [
  //       {
  //         text: 'Ok',
  //       },
  //     ],
  //     {cancelable: true},
  //   );
  // }
};
const handleUpdate = async (id, image) => {
  // const idImage = uuid.v4();
  // const reference = storage().ref(`Group/${id}/Avatar/${idImage}`);
  // await reference.putFile(image);
  // const newAvatar = await reference.getDownloadURL();
  // try {
  //   db.collection('Chats')
  //     .doc(id)
  //     .update({
  //       avatar: newAvatar,
  //     })
  //     .then(() => {
  //       console.log('====================================');
  //       console.log('Save success');
  //       console.log('====================================');
  //     });
  // } catch (error) {
  //   console.log(error);
  // }
};
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000000'},
  body: {
    width: SIZES.width,
    marginTop: 20,
    flex: 1,
    padding: 20,
  },
  items: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  _icon_box: {
    flexDirection: 'row',
    width: SIZES.width,
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
});
