import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import PageContainer from '../../components/PageContainer';
import {COLORS, SIZES, images, FONTS} from '../../constants';
import {db} from '../../firebase/firebaseConfig';
import {profileStore} from '../../store';
import Animated from 'react-native-reanimated';
import {Avatar, Image, ListItem} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import {UserType} from '../../contexts/UserContext';
import {ActivityIndicator, Icon} from 'react-native-paper';
export default function ServicePending() {
  const {profile} = profileStore();
  const {users} = useContext(UserType);
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(true);

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
            s => profile.service?.includes(s.id) && s.data.status == false,
          ),
        );
        setisLoading(false)
      });
  }, []);
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity>
        <ListItem
          linearGradientProps={{
            colors: [COLORS.white, COLORS.primary],
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
            <ListItem.Title style={{color: 'white', fontWeight: 'bold'}}>
              {item.data.name}
            </ListItem.Title>
            <ListItem.Subtitle style={{color: 'white'}} numberOfLines={1}>
              {item.data.organization}
            </ListItem.Subtitle>
          </ListItem.Content>
          <Icon source={'clock-time-five-outline'} size={30} color="green" />
        </ListItem>
      </TouchableOpacity>
    );
  };
  return (
    <PageContainer>
      <Text style={{...FONTS.h2}}>Dịch vụ đang chờ xác nhận</Text>
      {isLoading ? (
        <ActivityIndicator color={COLORS.primary} size={20} />
      ) : (
        <Animated.FlatList data={data} renderItem={renderItem} />
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  item: {height: 60, width: 60, borderRadius: 30},
});
