import {StyleSheet, Text, TouchableOpacity, View, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import PageContainer from '../../components/PageContainer';
import {COLORS, SIZES, images, FONTS} from '../../constants';
import {db} from '../../firebase/firebaseConfig';
import {authStore, profileStore} from '../../store';
import Animated from 'react-native-reanimated';
import {Avatar, Image, ListItem} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import {ActivityIndicator, Button} from 'react-native-paper';
import UISearch from '../../components/UISearch';
import {firebase} from '@react-native-firebase/auth';
export default function ListService({setIndex}) {
  const {profile} = profileStore();
  const {userId} = authStore();
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [message, setMessage] = useState(false);
  const [search, setSearch] = useState('');
  const [searchData, setSearchData] = useState([]);
  useEffect(() => {
    const res = [];
    db.collection('Service')
      .where('status', '==', true)
      .get()
      .then(doc => {
        doc.forEach(item => {
          service = {
            id: item.id,
            data: item.data(),
          };
          res.push(service);
        });
        const filter = res.filter(s => !s.data.follower.includes(userId));
        if (filter.length != 0) {
          setSearchData(filter);
          setMessage(false);
        } else {
          setMessage(true);
        }
        setData(filter);
        setisLoading(false);
      });
  }, []);
  useEffect(() => {
    if (search.length == 0) {
      setData(searchData);
    } else {
      setData(
        searchData.filter(s =>
          s.data.name.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }
  }, [search]);
  const handleFollow = (id, name, image) => {
    setData(data.filter(i => i.id != id));
    try {
      db.collection('Service')
        .doc(id)
        .update({
          follower: firebase.firestore.FieldValue.arrayUnion(userId),
        })
        .then(() => {
          const conversation_id = `${userId}-${id}`;
          db.collection('Conversations')
            .doc(conversation_id)
            .set(
              {
                type: 'Service',
                isOnline: true,
                last_message: new Date(),
                recipientId: id,
                senderID: userId,
                name,
                image,
                last_active_at: '',
                message: {
                  messageText: name,
                  name: 'Dịch vụ',
                  id,
                },
              },
              {merge: true},
            );
          Alert.alert('Thông báo !', `Theo dõi ${name}`, [
            {text: 'Đồng ý'},
          ]);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const renderItem = ({item}) => {
    return (
      <ListItem
        linearGradientProps={{
          colors: [COLORS.green, COLORS.primary],
          start: {x: 1, y: 0},
          end: {x: 0.3, y: 0},
        }}
        style={{width: SIZES.width, marginTop: 5}}
        ViewComponent={LinearGradient}>
        <Avatar
          rounded
          source={{uri: item.data.image}}
          size={50}
          avatarStyle={{resizeMode: 'contain'}}
        />
        <ListItem.Content>
          <ListItem.Title
            style={{color: 'white', fontWeight: 'bold'}}
            numberOfLines={1}>
            {item.data.name}
          </ListItem.Title>
          <ListItem.Subtitle style={{color: 'white'}} numberOfLines={1}>
            {item.data.organization}
          </ListItem.Subtitle>
        </ListItem.Content>
        <Button
          buttonColor={COLORS.primary}
          textColor="white"
          contentStyle={{width: 'auto'}}
          onPressOut={() => {
            handleFollow(item.id, item.data.name, item.data.image);
          }}>
          Theo dõi
        </Button>
      </ListItem>
    );
  };
  return (
    <PageContainer>
      <UISearch
        value={search}
        onChangeText={setSearch}
        onClear={() => setSearch('')}
      />
      {isLoading && <ActivityIndicator color={COLORS.primary} size={20} />}
      {!message ? (
        <Animated.FlatList data={data} renderItem={renderItem} />
      ) : (
        <Text style={{...FONTS.h2}}>Chưa có dịch vụ</Text>
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  item: {height: 60, width: 60, borderRadius: 30},
});
