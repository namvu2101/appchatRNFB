import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import PageContainer from '../../components/PageContainer';
import {COLORS, SIZES, images, FONTS} from '../../constants';
import {db} from '../../firebase/firebaseConfig';
import {profileStore} from '../../store';
import Animated from 'react-native-reanimated';
import {Avatar, ListItem} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import {UserType} from '../../contexts/UserContext';
import {firebase} from '@react-native-firebase/auth';
import {ActivityIndicator} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
export default function YourService() {
  const {profile} = profileStore();
  const {users} = useContext(UserType);
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const navigation = useNavigation();
  useEffect(() => {
    const res = [];
    db.collection('Service')
      .get()
      .then(doc => {
        doc.forEach(item => {
          service = {
            id: item.id,
            data: item.data(),
          };
          res.push(service);
        });
        setData(
          res.filter(
            s => profile.service?.includes(s.id) && s.data.status == true,
          ),
        );
        setisLoading(false);
      });
  }, []);
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ServiceChat', item)}>
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
          <ListItem.Chevron color="black" />
        </ListItem>
      </TouchableOpacity>
    );
  };
  return (
    <PageContainer>
      <Text style={{...FONTS.h2}}>Dịch vụ của bạn</Text>

      {isLoading ? (
        <ActivityIndicator color={COLORS.primary} size={20} />
      ) : (
        <Animated.FlatList data={data} renderItem={renderItem} />
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({});
