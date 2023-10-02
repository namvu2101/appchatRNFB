import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useContext, useLayoutEffect, useState, useEffect} from 'react';
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
import UIModals from '../../components/UIModals';
import {useIsFocused} from '@react-navigation/native';

const Messages = ({navigation}) => {
  const {setUserFriends, userFriends} = useContext(UserType);
  const [message, setMessage] = useState([]);
  const {profile, friends} = profileStore();
  const {userId} = authStore();
  const {conversations} = conversationStore();
  const [filterMessage, setFilterMessage] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isVisible, setisVisible] = useState(false);
  const isFocus = useIsFocused();

  useEffect(() => {
    if (searchQuery.length == 0) {
      setFilterMessage(message);
    } else {
      const filteredData = message.filter(user =>
        user.data.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilterMessage(filteredData);
    }
  }, [searchQuery]);
  useEffect(() => {
    setSearchQuery('');
  }, [isFocus]);

  useLayoutEffect(() => {
    getData();
  }, [friends]);

  useLayoutEffect(() => {
    if (conversations.length > 0) {
      const unsubscribe = db
        .collection('Conversations')
        .orderBy('last_message', 'desc')
        .onSnapshot(snapshot => {
          const res = [];
          snapshot.forEach(doc => {
            res.push({
              id: doc.id,
              data: doc.data(),
            });
          });
          const filteredConversations = res.filter(conversation =>
            conversations.includes(conversation.id),
          );
          setMessage(filteredConversations);
          setFilterMessage(filteredConversations);
        });

      return () => unsubscribe();
    } else {
      setMessage([]);
    }
  }, [conversations]);
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
  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 22,
            width: SIZES.width,
            marginTop: 10,
          }}>
          <Avatar.Image
            source={{
              uri: profile?.image || images.imageLoading,
            }}
            size={44}
          />
          <Text style={{...FONTS.h2}}>Đoạn Chat</Text>

          <TouchableOpacity onPress={() => navigation.navigate('AddChat')}>
            <MaterialCommunityIcons
              name="pencil"
              size={25}
              color={COLORS.secondaryBlack}
            />
          </TouchableOpacity>
        </View>
        <UISearch onChangeText={setSearchQuery} value={searchQuery} />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 22,
            marginBottom: 10,
          }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={userFriends}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Chats', {
                    item,
                    type: item?.type || 'Person',
                    conversation_id: `${userId}-${item.id}`,
                    recipientId: item.id,
                  })
                }
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 66,
                  height: 77,
                }}>
                <Avatar.Image
                  source={{uri: item.image || images.imageLoading}}
                  size={55}
                />
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
          data={filterMessage}
          renderItem={({item, index}) => (
            <Message_Items
              item={item.data}
              conversation_id={item.id}
              index={index}
              onPress={() => {
                navigation.navigate('Chats', {
                  item: item.data,
                  type: item?.data?.type,
                  conversation_id: item.id,
                  recipientId: item?.data?.recipientId,
                });
              }}
            />
          )}
          keyExtractor={item => item.id.toString()}
        />
      </PageContainer>
    </SafeAreaView>
  );
};

export default Messages;
