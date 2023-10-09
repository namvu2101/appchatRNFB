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

export default function Information({route}) {
  const id = route.params.id;
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const [isLoading, setisLoading] = useState(false);
  const [status, setStatus] = useState('');
  const {friends, sentRequestFriends, friendRequests} = profileStore();
  const [icon, setIcon] = useState('');
  useLayoutEffect(() => {
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
  }, [sentRequestFriends,friends,friendRequests]);
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
      value: data.phone,
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
            <Image
              source={{
                uri:
                  data?.backgroud ||
                  'https://th.bing.com/th/id/R.31a057b002e52be3a87c1554ab0df61f?rik=pUq4kE2yAahmbg&riu=http%3a%2f%2f4.bp.blogspot.com%2f-cFrX94jbehk%2fUQgQyh66j3I%2fAAAAAAAAAk4%2fqFaJ1jjlMV8%2fs1600%2f9b516f4441a7bfb5174b33ebf74fc1d6_49102622.freebackgrounds5.jpg&ehk=Koj52Q69rFc9d4z9WglpPOi%2fpBSpUT3sFBd9r1fhnok%3d&risl=&pid=ImgRaw&r=0]',
              }}
              style={{width: '100%', height: '80%'}}
              resizeMode="cover"
            />
            <View
              style={{
                position: 'absolute',
                height: '100%',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <Pressable
                onPress={() => {}}
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
