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
import UIModals from '../../components/UIModals';
import UITextInput from '../../components/UITextInput';
import Icon from 'react-native-vector-icons/Ionicons';
import {handlePickImage} from '../../components/ImagePicker';
import {authStore, conversationStore} from '../../store';
import uuid from 'react-native-uuid';
import Loading from '../../components/Loading';
import {UserType} from '../../contexts/UserContext';

export default function CreateGroup() {
  const navigation = useNavigation();
  const [isvisible, setIsVisible] = useState(false);
  const [member, setMember] = useState([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState('');
  const [submit, setSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {userFriends} = useContext(UserType);
  const [data, setdata] = useState(userFriends);
  const {userId} = authStore();
  const [search, setSearch] = useState('');
  useEffect(() => {
    if (search.length != 0) {
      const filter = userFriends.filter(
        item =>
          item.data.name.toLowerCase().includes(search.toLowerCase()) ||
          item.data.phone.includes(search),
      );
      setdata(filter);
    } else {
      setdata(userFriends);
    }
  }, [search]);
  const handleCreate = async input => {
    const idImage = uuid.v4();
    const docRef = db.collection('Conversations');
    if (input.length == 0) {
      Alert.alert('Thông báo !', 'Chưa nhập tên nhóm');
    } else if (image.length == 0) {
      Alert.alert('Thông báo !', 'Chưa chọn ảnh nhóm');
    } else {
      const member_id = member.map(i => i.id);
      try {
        setIsLoading(true);
        member_id.push(userId);
        const reference = storage().ref(`Conversations/Group/files/${idImage}`);
        const avatar = await uploadImage(reference, image);
        const time = new Date();
        docRef
          .add({
            type: 'Group',
            name: input,
            image: avatar,
            last_message: timestamp,
            messageText: 'Send somethings',
            create_id: userId,
            member_id: member_id,
            read: 'id da xem',
            isOnline: true,
            admin: [userId],
          })
          .then(async doc => {
            Alert.alert('Thông báo !', 'Tạo nhóm thành công', [
              {
                text: 'OK',
                onPress: () => {
                  setIsLoading(false);
                  navigation.replace('BottomTabs');
                },
              },
            ]);
            // addConversation(member_id, doc.id);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const uploadImage = async (reference, image) => {
    await reference.putFile(image);
    return await reference.getDownloadURL();
  };

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

  const onHide = () => {
    setInput('');
    setImage('');
    setIsVisible(false);
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
    if (member.length > 1) {
      setSubmit(true);
    } else {
      setSubmit(false);
    }
  }, [member]);
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
  const ChangeAvatar = async () => {
    const avatar = await handlePickImage();
    if (avatar != 'Error') {
      setImage(avatar);
    }
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
        <Pressable disabled={!submit} onPress={() => setIsVisible(true)}>
          <Text
            style={{
              ...FONTS.h3,
              color: submit ? COLORS.secondaryBlack : COLORS.secondaryGray,
            }}>
            Tiếp
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

      <UIModals isVisible={isvisible} onClose={onHide}>
        <View
          style={{
            backgroundColor: '#fff',
            padding: 22,
            marginHorizontal: 22,
            alignItems: 'center',
          }}>
          <Pressable
            onPress={() => {
              ChangeAvatar();
            }}
            style={styles.avatarContainer}>
            {image.length != 0 ? (
              <Avatar.Image source={{uri: image}} size={66} />
            ) : (
              <Icon
                name="person-circle-outline"
                size={66}
                color={COLORS.black}
              />
            )}
            <Text style={styles.changeAvatarText}>Ảnh nhóm</Text>
          </Pressable>
          <Text style={{...FONTS.h4}}>Đặt tên cho đoạn chat mới</Text>
          <UITextInput
            style={{height: 44}}
            placeholder="Tên nhóm (Bắt buộc)"
            value={input}
            onChangeText={setInput}
            onSubmit={() => handleCreate(input)}
          />
          <View style={styles.buttonContainer}>
            <Button textColor="#2C6BED" onPress={onHide}>
              Hủy
            </Button>
            <Button textColor="#2C6BED" onPress={() => handleCreate(input)}>
              Tạo
            </Button>
          </View>
        </View>
      </UIModals>
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
