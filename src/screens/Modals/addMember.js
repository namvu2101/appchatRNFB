import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {SIZES, COLORS, FONTS, images} from '../../constants';
import {Avatar, Checkbox} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {useSharedValue, withSpring} from 'react-native-reanimated';
import UISearch from '../../components/UISearch';
import {UserType} from '../../contexts/UserContext';
import {db} from '../../firebase/firebaseConfig';

export default function AddNewMember({data, onClose, id}) {
  const [member, setMember] = useState([]);
  const [submit, setSubmit] = useState(false);
  const [search, setSearch] = useState('');
  const [list, setList] = useState([]);
  const {users} = useContext(UserType);

  useEffect(() => {
    if (member.length != 0) {
      setSubmit(true);
    } else {
      setSubmit(false);
    }
  }, [member]);
  //   useEffect(() => {
  //     const res = users.filter(item => !data.includes(item.id));
  //     setList(res);
  //   }, []);
  useEffect(() => {
    const res = users.filter(item => !data.includes(item.id));
    if (search.length != 0) {
      const filter = res.filter(
        item =>
          item.data.name.toLowerCase().includes(search.toLowerCase()) ||
          item.data.phone.includes(search),
      );
      setList(filter);
    } else {
      setList(res);
    }
  }, [search]);
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
  const handleAdd = () => {
    const member_id = member.map(i => i.id);
    const newMember = member_id.concat(data);
    setSubmit(false);
    db.collection('Conversations')
      .doc(id)
      .update({
        member_id: newMember,
      })
      .then(() => {
        onClose();
        Alert.alert('Thông báo!', 'Thêm thành công');
      })
      .catch(e => console.log(e));
  };

  const viewMember = () => {
    const height = useSharedValue(80);
    useEffect(() => {
      if (member.length == 0) {
        height.value = withSpring(height.value - 80, {
          damping: 100,
          stiffness: 300,
        });
      } else {
        height.value = withSpring(80, {damping: 100, stiffness: 300});
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

  const renderItem = ({item}) => {
    return (
      <View style={styles.memberItem}>
        <Avatar.Image
          source={{uri: item.data.image || images.imageLoading}}
          size={44}
        />
        <View style={{marginHorizontal: 10}}>
          <Text
            style={{...FONTS.h3, width: SIZES.width * 0.44}}
            numberOfLines={2}>
            {item.data.name}
          </Text>
          <Text style={{...FONTS.h4, color: COLORS.gray}}>
            {item.data.phone}
          </Text>
        </View>
        <Checkbox.Item
          status={member.some(m => m.id === item.id) ? 'checked' : 'unchecked'}
          onPress={() => onPress(item)}
          color="red"
          uncheckedColor="blue"
        />
      </View>
    );
  };

  return (
    <View
      style={{
        backgroundColor: '#FFF',
        paddingHorizontal: 22,
      }}>
      <View
        style={{
          flexDirection: 'row',
          height: 50,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Pressable onPress={onClose}>
          <MaterialCommunityIcons name="close" size={25} color="#000" />
        </Pressable>

        <Text style={{...FONTS.h2}}>Thêm thành viên</Text>
        <Pressable
          onPress={() => {
            handleAdd();
          }}
          disabled={!submit}>
          <Text
            style={{
              ...FONTS.h3,
              color: submit ? COLORS.secondaryBlack : COLORS.secondaryGray,
            }}>
            Thêm
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
      <FlatList data={list} renderItem={renderItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  memberItem: {
    height: 55,
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
