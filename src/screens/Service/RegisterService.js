import {
  Pressable,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {COLORS, SIZES, images, FONTS} from '../../constants';
import {Avatar, TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import UITextInput from '../../components/UITextInput';
import UIButton from '../../components/UIButton';
import PageContainer from '../../components/PageContainer';
import uuid from 'react-native-uuid';

import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {handlePickImage} from '../../components/ImagePicker';
import {db, storage} from '../../firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {firebase} from '@react-native-firebase/auth';
import {profileStore} from '../../store';
import Loading from '../Dialog/Loading';

export default function RegisterService({setIndex}) {
  const {profile, updateService} = profileStore();
  const [service, setService] = useState(profile.service);
  const [isLoading, setisLoading] = useState(false);
  const [state, setState] = useState([
    {
      name: 'Tên Dịch vụ',
      value: 'Nhập tên dịch vụ',
      inputMode: 'text',
    },
    {
      name: 'Địa chỉ email',
      value: 'Nhập email',
      inputMode: 'email',
    },
    {
      name: 'Địa chỉ',
      value: 'Nhập địa chỉ',
      inputMode: 'text',
    },
    {
      name: 'Tên tổ chức',
      value: 'Nhập...',
      inputMode: 'text',
    },
  ]);
  const keyboard = useAnimatedKeyboard();
  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: -keyboard.height.value}],
    };
  });
  const onChangeText = (index, text) => {
    const updatedFields = [...state];
    updatedFields[index].value = text;
    setState(updatedFields);
  };
  const [image, setImage] = useState('');
  const uploadImage = async (reference, image) => {
    await reference.putFile(image);
    return await reference.getDownloadURL();
  };
  const ChangeAvatar = async () => {
    const avatar = await handlePickImage();
    if (avatar != 'Error') {
      setImage(avatar.uri);
    }
  };
  const handleRegister = async () => {
    const date = new Date();
    const newDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    const idImage = uuid.v4();
    try {
      setisLoading(true);
      const reference = storage().ref(`Service/Avatar/${idImage}`);
      const avatarUrl = await uploadImage(reference, image);
      const userId = await AsyncStorage.getItem('userId');
      await db
        .collection('Service')
        .add({
          image: avatarUrl,
          name: state[0].value,
          email: state[1].value,
          address: state[2].value,
          organization: state[3].value,
          follower: [],
          date: newDate,
          status: false,
        })
        .then(async doc => {
          await service.push(doc.id);
          db.collection('users')
            .doc(userId)
            .set(
              {
                service: firebase.firestore.FieldValue.arrayUnion(doc.id),
              },
              {merge: true},
            );
          Alert.alert('Thông báo!', 'Dịch vụ của bạn đang chờ xác nhận', [
            {
              text: 'Xác nhận',
              onPress: () => {
                setisLoading(false);
                updateService(service, profile);
                setIndex(2);
              },
            },
          ]);
        });
    } catch (error) {
      Alert.alert('Thông báo!', 'Đã xảy ra lỗi');
      console.log(error);
    }
  };
  return (
    <PageContainer
      style={{
        justifyContent: 'space-evenly',
      }}>
      <Text style={{...FONTS.h2}}>Đăng ký dịch vụ mới</Text>
      <Pressable
        onPress={ChangeAvatar}
        style={{
          width: 100,
          height: 100,
          backgroundColor: COLORS.secondaryWhite,
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {image.length != 0 ? (
          <Avatar.Image
            source={{uri: image || images.imageLoading}}
            size={80}
          />
        ) : (
          <Icon name="image-outline" size={84} color={COLORS.black} />
        )}
      </Pressable>
      <Animated.View style={translateStyle}>
        {state.map((item, index) => (
          <UITextInput
            style={{width: SIZES.width, paddingHorizontal: 22}}
            title={item.name}
            value={item.value}
            key={item.name}
            inputMode={item.inputMode}
            onChangeText={text => onChangeText(index, text)}
          />
        ))}
      </Animated.View>
      <UIButton title="Đăng ký" onPress={handleRegister} />
      <Loading isVisible={isLoading} />
    </PageContainer>
  );
}

const styles = StyleSheet.create({});
