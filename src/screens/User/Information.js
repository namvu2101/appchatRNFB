import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
} from 'react-native';
import React, {useLayoutEffect, useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import {SIZES, images, FONTS, COLORS} from '../../constants';
import {
  ActivityIndicator,
  Avatar,
  Button,
  IconButton,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {db, timestamp} from '../../firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {profileStore} from '../../store';
import {handleActions} from './actions';
import UIModals from '../../components/UIModals';
import ImageModals from '../Modals/ImageModals';

export default function Information({route}) {
  const [isVisible, setisVisible] = React.useState(false);
  const id = route.params.id;
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const [isLoading, setisLoading] = useState(false);
  const [status, setStatus] = useState('');
  const {friends, sentRequestFriends, friendRequests} = profileStore();
  const [icon, setIcon] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({headerTitle: 'Thông tin người dùng'});
    getData();
    setTimeout(() => {
      setisLoading(true);
    }, 300);
  }, []);
  const getData = async () => {
    const user = await db.collection('users').doc(id).get();
    setData(user.data());
  };
  const handleChat = async () => {
    const userId = await AsyncStorage.getItem('userId');
    navigation.navigate('Chats', {
      item: data,
      type: data?.type || 'Person',
      conversation_id: `${userId}-${id}`,
      recipientId: id,
    });
  };
  useEffect(() => {
    getStatus();
  }, [sentRequestFriends, friends, friendRequests]);
  const getStatus = async () => {
    if (friends.find(i => i == id)) {
      setStatus('Bạn bè');
      setIcon('account-check');
    } else if (sentRequestFriends.find(i => i == id)) {
      setStatus('Hủy yêu cầu');
      setIcon('account-remove');
    } else if (friendRequests.find(i => i == id)) {
      setStatus('Chấp nhận');
      setIcon('account-plus');
    } else {
      setStatus('Kết bạn');
      setIcon('account-arrow-right');
    }
  };
  const list = [
    {
      name: 'Email',
      value: data?.email || 'Chưa cập nhật email',
      editable: false,
      inputMode: 'email',
    },
    {
      name: 'Giới tính',
      value: data?.sex || 'Chưa cập nhật',
      editable: false,
      inputMode: 'email',
    },
    {
      name: 'Địa chỉ',
      value: data?.add || 'Chưa cập nhật địa chỉ',
      editable: false,
      inputMode: 'text',
    },
    {
      name: 'Ngày sinh',
      value: data?.date || 'Chưa cập nhật',
      editable: false,
      inputMode: 'numeric',
    },
    {
      name: 'SĐT',
      value: data?.phone,
      editable: false,
      inputMode: 'numeric',
    },
    
  ];

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <PageContainer style={{paddingHorizontal: 22, paddingBottom: 30}}>
          <View
            style={{
              alignItems: 'center',
              width: SIZES.width,
              height: '40%',
            }}>
            <Pressable
              style={{width: '100%', height: '80%'}}
              onPress={() =>
                navigation.navigate('MediaScreen', {
                  uri: data?.backgroundImage || images.imageBackground,
                  mediaType: 'photo',
                })
              }>
              <Image
                source={{
                  uri: data?.backgroundImage || images.imageBackground,
                }}
                style={{width: '100%', height: '100%'}}
                resizeMode="cover"
              />
            </Pressable>

            <View
              style={{
                position: 'absolute',
                height: '100%',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <Pressable
                onPress={() =>
                  navigation.navigate('MediaScreen', {
                    uri: data?.image,
                    mediaType: 'photo',
                  })
                }
                style={{
                  backgroundColor: 'white',
                  borderRadius: 55,
                  height: 110,
                  width: 110,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Avatar.Image
                  source={{uri: data?.image || images.imageLoading}}
                  size={100}
                />
              </Pressable>
              <Text style={{...FONTS.h2}}>{data.name}</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginVertical: 10,
              justifyContent: 'space-between',
              width: SIZES.width * 0.7,
            }}>
            <Button
              onPress={() => handleActions(status, id)}
              icon={icon}
              buttonColor={COLORS.green}
              style={{borderRadius: 10}}
              textColor="black">
              {status}
            </Button>
            <Button
              onPress={handleChat}
              icon={'facebook-messenger'}
              buttonColor={COLORS.primary}
              style={{borderRadius: 10}}
              textColor="white">
              Nhắn tin
            </Button>
          </View>
          {isLoading ? (
            <>
              {list.map((field, index) => (
                <View key={index} style={{width: '100%', marginBottom: 10}}>
                  <Text style={{...FONTS.h4, color: COLORS.secondaryGray}}>
                    {field.name}
                  </Text>
                  <View
                    style={{
                      height: 50,
                      borderColor: COLORS.secondaryGray,
                      borderWidth: 1,
                      borderRadius: 25,
                      justifyContent: 'center',
                      paddingLeft: 10,
                    }}>
                    <Text style={{...FONTS.h3}}>{field.value}</Text>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <ActivityIndicator size={30} color="black" />
          )}
        </PageContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
