import {Pressable, View, Alert, Text, StyleSheet} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import {COLORS, SIZES, FONTS, images} from '../../constants';
import Icon from 'react-native-vector-icons/Ionicons';
import UIButton from '../../components/UIButton';
import UITextInput from '../../components/UITextInput';
import {Avatar, Button, TextInput} from 'react-native-paper';
import {handlePickImage} from '../../components/ImagePicker';
import storage from '@react-native-firebase/storage';
import {db} from '../../firebase/firebaseConfig';
import {validatePassword} from '../../constants/validate';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Loading from '../../screens/Dialog/Loading';

const CreateProfile = ({navigation, route}) => {
  const phoneNumber = route.params;
  const [image, setImage] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('123456');
  const [secure, setSecure] = useState(true);
  const [submit, setsubmit] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Điền thông tin tài khoản',
    });
  }, []);
  const handleRegister = async () => {
    const date = new Date();
    const newDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;

    const user = {
      name: userName,
      phone: phoneNumber,
      password: password,
      status: true,
      last_active_at: date,
      add: '',
      email: email,
      date: newDate,
      isOnline: true,
      service: [],
      sex: '',
    };
    const usersCollection = db.collection('users');
    usersCollection
      .add(user)
      .then(async docRef => {
        const userId = docRef.id;
        const newAvatar = await uploadImage(userId, image);
        await docRef.update({image: newAvatar, backgroundImage: newAvatar});
        AsyncStorage.setItem('userId', userId);
        setIsLoading(false);
        navigation.replace('Splash');
      })
      .catch(error => console.error('Đăng ký không thành công:', error));
  };
  useEffect(() => {
    if (email.length == 0 || userName.length == 0 || password.length == 0) {
      setsubmit(true);
    } else setsubmit(false);
  }, [email, userName, password]);
  const CheckValue = async () => {
    const validationResult = validatePassword(password);
    if (validationResult === null) {
      if (image.length == 0) {
        setErrorMessage('Chưa chọn ảnh đại diện');
      } else {
        setIsLoading(true);
        await handleRegister();
      }
    } else {
      setErrorMessage('Lỗi: ' + validationResult);
    }
  };

  const uploadImage = async (id, image) => {
    const reference = storage().ref(`Users/${id}/Files/${file.fileName}`);
    await reference.putFile(image);
    return await reference.getDownloadURL();
  };

  const ChangeAvatar = async () => {
    const avatar = await handlePickImage();
    if (avatar != 'Error') {
      setImage(avatar.uri);
      setFile(avatar);
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer style={{justifyContent: 'center'}}>
        <Pressable onPress={ChangeAvatar} style={styles._avatar}>
          {image.length != 0 ? (
            <Avatar.Image source={{uri: image}} size={80} />
          ) : (
            <Icon name="person-circle-outline" size={84} color={COLORS.black} />
          )}

          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
            }}>
            <Icon name="image-outline" size={24} color={COLORS.black} />
          </View>
        </Pressable>

        <UITextInput
          title="Email"
          value={email}
          inputMode="email"
          onChangeText={setemail}
        />
        <UITextInput
          title="Tên của bạn"
          value={userName}
          onChangeText={setUserName}
        />
        <UITextInput
          title="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secure={secure}
          right={
            <TextInput.Icon
              onPress={() => setSecure(!secure)}
              icon={secure ? 'eye-off' : 'eye'}
              color={COLORS.black}
            />
          }
        />
        <Text
          style={{
            ...FONTS.h4,
            color: 'red',
            marginBottom: 10,
            textAlign: 'center',
          }}>
          {errorMessage}
        </Text>

        <UIButton
          disabled={submit}
          title="Đăng ký"
          style={{marginVertical: 44}}
          onPress={() => CheckValue()}
        />
        
        <Loading isVisible={isLoading} />
      </PageContainer>
    </SafeAreaView>
  );
};

export default CreateProfile;

const styles = StyleSheet.create({
  _avatar: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.secondaryWhite,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
