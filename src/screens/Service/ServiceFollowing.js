import {StyleSheet, Text, TouchableOpacity, View, Alert} from 'react-native';
import React, {useEffect, useState, useLayoutEffect} from 'react';
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
export default function ServiceFollowing() {
  const {profile} = profileStore();
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [message, setMessage] = useState(false);
  const {userId} = authStore();
  useEffect(() => {
    const res = [];
    db.collection('Service')
      .where('status', '==', true)
      .get()
      .then(async doc => {
        doc.forEach(item => {
          service = {
            id: item.id,
            data: item.data(),
          };
          res.push(service);
        });
        const filter = res.filter(s => s.data.follower.includes(userId));
        if (filter.length != 0) {
          setMessage(false);
        } else {
          setMessage(true);
        }
        setData(filter);
        setisLoading(false);
      });
  }, []);

  const handleUnFollow = (id, name) => {
    try {
      db.collection('Service')
        .doc(id)
        .update({
          follower: firebase.firestore.FieldValue.arrayRemove(userId),
        })
        .then(() => {
          Alert.alert('Thông báo !', `Bỏ theo dõi ${name}`);
          setData(data.filter(s => s.id != id));
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
            handleUnFollow(item.id, item.data.name);
          }}>
          Bỏ theo dõi
        </Button>
      </ListItem>
    );
  };
  return (
    <PageContainer>
      <UISearch />
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
