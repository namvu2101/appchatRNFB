import {StyleSheet, Text, View, Pressable, FlatList, Alert} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import Animated, {useSharedValue, withSpring} from 'react-native-reanimated';
import {Avatar, Button, Checkbox, TextInput} from 'react-native-paper';
import {db, storage, timestamp} from '../../firebase/firebaseConfig';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, FONTS, SIZES, images} from '../../constants';
import UISearch from '../../components/UISearch';
import {authStore, conversationStore, profileStore} from '../../store';
import {UserType} from '../../contexts/UserContext';
import {CheckBox} from '@rneui/themed';
import Loading from '../Dialog/Loading';

export default function CreateGroup({route}) {
  const navigation = useNavigation();
  const [member, setMember] = useState([]);
  const [submit, setSubmit] = useState(false);
  const {userFriends} = useContext(UserType);
  const [data, setdata] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {profile} = profileStore();
  const {userId} = authStore();
  useEffect(() => {
    const res = route.params
      ? userFriends.filter(item => !route.params.data.includes(item.id))
      : userFriends;
    if (search.length != 0) {
      const filter = res.filter(
        item =>
          item.data.name.toLowerCase().includes(search.toLowerCase()) ||
          item.data.phone.includes(search),
      );
      setdata(filter);
    } else {
      setdata(res);
    }
  }, [search]);

  const addConversation = (data, id) => {
    data.map(i => {
      db.collection('conversations')
        .doc(i)
        .set(
          {list_conversations: firebase.firestore.FieldValue.arrayUnion(id)},
          {merge: true},
        );
    });
  };
  const handleAdd = () => {
    setIsLoading(true);
    const member_id = member.map(i => i.id);
    const newMember = member_id.concat(route.params.data);
    setSubmit(false);
    db.collection('Conversations')
      .doc(route.params.id)
      .update({
        member_id: newMember,
        last_message: new Date(),
        message: {
          messageText: `đã thêm +${member_id.length} người vào`,
          name: profile.name,
          id: userId,
        },
      })
      .then(() => {
        Alert.alert('Thông báo!', 'Thêm thành công', [
          {
            text: 'Đồng ý',
            onPress: () => {
              setIsLoading(false);
              navigation.replace('BottomTabs');
            },
          },
        ]);
      })
      .catch(e => {
        console.error('Đã xảy ra lỗi', e);
        setIsLoading(false);
      });
  };
  const onPress = item => {
    // Kiểm tra xem item có trong danh sách member không
    const itemIndex = member.findIndex(m => m.id === item.id);
    if (itemIndex === -1) {
      // Nếu không có, thêm item vào danh sách member
      setMember([item, ...member]);
    } else {
      // Nếu có, loại bỏ item khỏi danh sách member
      const updatedMember = [...member];
      updatedMember.splice(itemIndex, 1);
      setMember(updatedMember);
    }
  };
  useEffect(() => {
    if ((route.params && member.length > 0) || member.length > 1) {
      setSubmit(true);
    } else {
      setSubmit(false);
    }
  }, [member]);
  const renderItem = ({item}) => {
    return (
      <View style={styles.memberItem}>
        <View
          style={{
            height: 50,
            width: 50,
            borderRadius: 25,
            borderColor: COLORS.primary,
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Avatar.Image
            source={{uri: item.data.image || images.imageLoading}}
            size={44}
          />
        </View>

        <View style={{marginHorizontal: 10}}>
          <Text
            style={{...FONTS.h3, width: SIZES.width * 0.44}}
            numberOfLines={2}>
            {item.data.name}
          </Text>
        </View>
        <CheckBox
          uncheckedColor="blue"
          checkedColor="#05FF05"
          checked={member.some(m => m.id === item.id) ? true : false}
          onPress={() => onPress(item)}
        />
      </View>
    );
  };

  const viewMember = () => {
    const height = useSharedValue(0);
    useEffect(() => {
      if (member.length != 0) {
        height.value = withSpring(80, {
          damping: 100,
          stiffness: 300,
        });
      } else {
        height.value = withSpring(0, {damping: 100, stiffness: 300});
      }
    }, [member]);
    return (
      <Animated.View style={{height: height}}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={member}
          renderItem={({item}) => (
            <Pressable
              onPress={() => onPress(item)}
              style={{
                marginHorizontal: 5,
                alignItems: 'center',
              }}>
              <Avatar.Image
                source={{uri: item.data.image || images.imageLoading}}
                size={44}
              />
              <Text
                style={{...FONTS.h4, textAlign: 'center', width: 55}}
                numberOfLines={1}>
                {item.data.name}
              </Text>
              <MaterialCommunityIcons
                name="alpha-x-circle"
                size={20}
                color={COLORS.secondaryBlack}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: -5,
                }}
              />
            </Pressable>
          )}
        />
      </Animated.View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#FFF', paddingHorizontal: 22}}>
      <View
        style={{
          flexDirection: 'row',
          height: 50,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={25} color="#000" />
        </Pressable>

        <Text style={{...FONTS.h2}}>Thêm thành viên</Text>
        <Pressable
          disabled={!submit}
          onPress={() => {
            if (route.params) {
              handleAdd();
            } else {
              navigation.navigate('CreateInforGroup', member);
            }
          }}>
          <Text
            style={{
              ...FONTS.h3,
              color: submit ? COLORS.secondaryBlack : COLORS.secondaryGray,
            }}>
            {route.params ? 'Thêm' : 'Tiếp'}
          </Text>
        </Pressable>
      </View>
      <UISearch
        value={search}
        onChangeText={setSearch}
        onClear={() => setSearch('')}
      />
      {viewMember()}

      <Text style={{...FONTS.h4, color: COLORS.secondaryGray}}>Gợi ý</Text>

      <FlatList data={data} renderItem={renderItem} />
      <Loading isVisible={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    height: 500,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  avatarImage: {
    height: 70,
    width: 70,
  },
  changeAvatarText: {
    color: '#000',
    padding: 5,
    backgroundColor: '#DCDCDC',
    borderRadius: 15,
  },
  memberItem: {
    height: 55,
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectButton: {
    borderRadius: 10,
    borderColor: '#000',
    borderWidth: 1,
    height: 20,
    width: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    marginVertical: 10,
  },
});
