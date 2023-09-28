import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useContext, useLayoutEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import {Avatar, Searchbar} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FONTS, COLORS, images, SIZES} from '../../constants';
import {contacts} from '../../constants/data';
import UISearch from '../../components/UISearch';
import {authStore, conversationStore, profileStore} from '../../store';
import Message_Items from './Message_Items';
import {UserType} from '../../../UserContext';
import {db} from '../../firebase/firebaseConfig';
import {firebase} from '@react-native-firebase/firestore';

const Messages = ({navigation}) => {
  const {setUserFriends, userFriends} = useContext(UserType);
  const [message, setMessage] = useState([]);
  const {profile, friends} = profileStore();
  const {userId} = authStore();
  const {conversations} = conversationStore();
  const [filteredUsers, setFilteredUsers] = useState(contacts);
  const [searchQuery, setSearchQuery] = React.useState('');
  const handleSearch = text => {
    setSearch(text);
    const filteredData = contacts.filter(user =>
      user.userName.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredUsers(filteredData);
  };
  useLayoutEffect(() => {
    const getData = async () => {
      const promises = friends.map(async id => {
        const doc = await db.collection('users').doc(id).get();
        return {
          id: doc.id,
          name: doc.data().name,
          image: doc.data().image,
          last_active_at: doc.data().last_active_at,
          phone: doc.data().phone,
        };
      });
      const users = await Promise.all(promises);
      setUserFriends(users);
    };

    getData();
  }, [friends]);
  useLayoutEffect(() => {
    if (conversations.length > 0) {
      const unsubscribe = db
        .collection('Conversations')
        .where(firebase.firestore.FieldPath.documentId(), 'in', conversations)
        .onSnapshot(snapshot => {
          const res = [];
          snapshot.forEach(doc => {
            res.push({
              id: doc.id,
              data: doc.data(),
            });
          });

          res.sort(
            (a, b) => (b.data.last_message || 0) - (a.data.last_message || 0),
          );

          setMessage(res);
        });

      return () => unsubscribe();
    } else {
      setMessage([]);
    }
  }, [conversations]);
  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 22,
            marginTop: 22,
            width: SIZES.width,
          }}>
          <Avatar.Image
            source={{
              uri:
                profile?.image ||
                'https://th.bing.com/th/id/R.7264dc52a5fed9616a2687dd8b040b05?rik=cOkUXWXWe4k2eQ&pid=ImgRaw&r=0',
            }}
            size={42}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: 80,
            }}>
            <TouchableOpacity onPress={() => console.log('Add contacts')}>
              <MaterialCommunityIcons
                name="message-badge-outline"
                size={25}
                color={COLORS.secondaryBlack}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Add contacts')}>
              <MaterialCommunityIcons
                name="playlist-check"
                size={25}
                color={COLORS.secondaryBlack}
              />
            </TouchableOpacity>
          </View>
        </View>
        <UISearch
          onChangeText={setSearchQuery}
          value={searchQuery}
          onPress={() => console.log(searchQuery)}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 22,
            marginBottom: 10,
          }}>
          {/* <View
            style={{
              alignItems: 'center',
              marginRight: 4,
            }}>
            <TouchableOpacity
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#e6edff',
                  marginBottom: 4,
                }}>
                <MaterialCommunityIcons name="plus" size={24} color={COLORS.black} />
              </TouchableOpacity>
          </View> */}

          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={userFriends}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Chats', {item, type: 'Person'})
                }
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 66,
                  height: 77,
                }}>
                <Avatar.Image source={{uri: item.image}} size={55} />
                <Text style={{color: COLORS.black, flex: 1}} numberOfLines={1}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        {message.length == 0 && (
          <Text style={{...FONTS.h3, color: COLORS.black}}>
            Chưa có tin nhắn
          </Text>
        )}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={message}
          renderItem={({item, index}) => (
            <Message_Items item={item.data} index={index} onPress={() => {}} />
          )}
          keyExtractor={item => item.id.toString()}
        />
      </PageContainer>
    </SafeAreaView>
  );
};

export default Messages;
