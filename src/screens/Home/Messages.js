import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useContext, useLayoutEffect, useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import {ActivityIndicator, Avatar, Badge, Searchbar} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FONTS, COLORS, images, SIZES} from '../../constants';
import {contacts} from '../../constants/data';
import UISearch from '../../components/UISearch';
import {authStore, conversationStore, profileStore} from '../../store';
import Message_Items from './Message_Items';
import {UserType} from '../../../UserContext';


const Messages = ({navigation}) => {
  const {setUserFriends, userFriends, users, userConversations} =
    useContext(UserType);
  const [message, setMessage] = useState([]);
  const {profile, friends} = profileStore();
  const {userId} = authStore();
  const {conversations} = conversationStore();
  const [isLayoutEffectDone, setIsLayoutEffectDone] = useState(false);

  useLayoutEffect(() => {
    const getData = async () => {
      const list_friend = users.filter(item => friends.includes(item.id));
      setUserFriends(list_friend);
    };
    getData();
  }, [friends]);

  useLayoutEffect(() => {
    const getConversations = async () => {
      const filter = userConversations.filter(
        i => i.data?.senderID == userId || i.data?.member_id?.includes(userId),
      );
      setMessage(filter);
      setIsLayoutEffectDone(true);
    };
    getConversations();
  }, [userConversations]);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Chats', {
            item: item.data,
            type: 'Person',
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
        <View
          style={{
            borderColor: 'blue',
            height: 54,
            width: 54,
            borderWidth: 1,
            borderRadius: 27,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Avatar.Image
            source={{uri: item.data.image || images.imageLoading}}
            size={50}
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

        <Text style={{color: COLORS.black, flex: 1}} numberOfLines={1}>
          {item.data.name}
        </Text>
      </TouchableOpacity>
    );
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
          <Text style={{...FONTS.h2}}>Đoạn chat</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '20%',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity onPress={() => navigation.navigate('AddContact')}>
              <MaterialCommunityIcons
                name="account-plus-outline"
                size={25}
                color={COLORS.secondaryBlack}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('AddChat')}>
              <MaterialCommunityIcons
                name="chat-plus-outline"
                size={25}
                color={COLORS.secondaryBlack}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Search', {conversations: message})
          }>
          <UISearch editable={false} />
        </TouchableOpacity>

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
            renderItem={renderItem}
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
