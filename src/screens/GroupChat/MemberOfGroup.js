import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState, useLayoutEffect} from 'react';
import {Button, Icon} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, FONTS, SIZES, images} from '../../constants';
import {auth, db} from '../../firebase/firebaseConfig';
import {authStore} from '../../store';
import PageContainer from '../../components/PageContainer';
import {useNavigation} from '@react-navigation/native';
import {Avatar, ListItem} from '@rneui/themed';

export default function ViewMember({route}) {
  const [isSelect, setisSelect] = useState('1');
  const [member, setMember] = useState([]);
  const {userId} = authStore();
  const navigation = useNavigation();
  const group = route.params;
  useLayoutEffect(() => {
    navigation.setOptions({headerTitle: 'Thành viên'});
    const list = [];
    db.collection('users')
      .get()
      .then(doc => {
        doc.docs.map(i => {
          const user = {
            id: i.id,
            name: i.data().name,
            image: i.data().image,
          };
          list.push(user);
        });
        const filteredList = list.filter(item =>
          group.member_id.includes(item.id),
        );
        setMember(filteredList);
      });
  }, []);
  const renderItem = ({item}) => {
    return (
      <ListItem containerStyle={styles._items} bottomDivider>
        <View style={styles._image}>
          <View
            style={{
              ...styles._badge,
              backgroundColor: item?.isOnline ? COLORS.green : COLORS.gray,
            }}
          />

          <Avatar
            rounded
            source={{
              uri: item?.image || images.imageLoading,
            }}
            size={45}
          />
        </View>
        <ListItem.Content>
          <ListItem.Title style={{fontWeight: 'bold'}} numberOfLines={1}>
            {item.name}
          </ListItem.Title>
        </ListItem.Content>
        {item.id != group.create_id && (
          <Icon source={'delete'} size={25} color="black" />
        )}
      </ListItem>
    );
  };
  return (
    <PageContainer>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 22,
          justifyContent: 'space-between',
        }}>
        <Button
          mode="outlined"
          onPress={() => setisSelect('1')}
          buttonColor={isSelect == 1 && COLORS.green}
          textColor={isSelect == 1 ? COLORS.white : COLORS.black}
          style={{flex: 1}}>
          Thành viên
        </Button>
        <Button
          mode="outlined"
          onPress={() => setisSelect('2')}
          buttonColor={isSelect == 2 && COLORS.green}
          style={{flex: 1}}
          textColor={isSelect == 2 ? COLORS.white : COLORS.black}>
          quản trị viên
        </Button>
      </View>
      <Text style={{...FONTS.h3, marginVertical: 10}}>
        Số lượng thành viên : {member.length}
      </Text>
      <FlatList
        data={member}
        contentContainerStyle={{width: SIZES.width}}
        renderItem={renderItem}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  _items: {
    height: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  _image: {
    borderColor: 'blue',
    height: 50,
    width: 50,
    borderWidth: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  _badge: {
    flex: 1,
    height: 14,
    width: 14,
    borderRadius: 7,
    borderColor: COLORS.white,
    borderWidth: 2,
    position: 'absolute',
    bottom: 0,
    right: 2,
    zIndex: 1000,
  },
});
