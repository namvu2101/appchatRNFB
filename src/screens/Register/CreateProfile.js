import {Pressable, View, Alert, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import {COLORS, SIZES, FONTS} from '../../constants';
import Icon from 'react-native-vector-icons/Ionicons';
import UIButton from '../../components/UIButton';
import UITextInput from '../../components/UITextInput';
import {Avatar, TextInput} from 'react-native-paper';
import {handlePickImage} from '../../components/ImagePicker';
import uuid from 'react-native-uuid';
import storage from '@react-native-firebase/storage';
import {db, timestamp} from '../../firebase/firebaseConfig';
import {validatePassword} from '../../constants/validate';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateProfile = ({navigation, route}) => {
  const phoneNumber = route.params;
  const [image, setImage] = useState('');
  const [userName, setUserName] = useState('');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('123456');
  const [secure, setSecure] = useState(true);
  const [submit, setsubmit] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    const idImage = uuid.v4();
    const usersCollection = db.collection('users');
    const reference = storage().ref(`users/Avatar/${idImage}`);
    const avatar = await uploadImage(reference, image);
    const user = {
      name: userName,
      phone: phoneNumber,
      password: password,
      image: avatar,
      status: true,
      last_active_at: timestamp,
    };

    usersCollection
      .add(user)
      .then(docRef => {
        const userId = docRef.id;
        AsyncStorage.setItem('userId', userId);
        navigation.replace('Loading');
      })
      .catch(error => console.error('Lỗi khi thêm người dùng:', error));
  };
  useEffect(() => {
    if (account.length == 0 || userName.length == 0 || password.length == 0) {
      setsubmit(true);
    } else setsubmit(false);
  }, [account, userName, password]);

  const CheckValue = () => {
    const validationResult = validatePassword(password);
    if (validationResult === null) {
      if (image.length == 0) {
        setErrorMessage('chua chon avatar');
      } else {
        handleRegister();
      }
    } else {
      setErrorMessage('Lỗi: ' + validationResult);
    }
  };

  const uploadImage = async (reference, image) => {
    await reference.putFile(image);
    return await reference.getDownloadURL();
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer style={{justifyContent: 'center'}}>
        <Pressable
          onPress={() => handlePickImage(setImage)}
          style={{
            width: 100,
            height: 100,
            backgroundColor: COLORS.secondaryWhite,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
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
          title="Tên tài khoản"
          value={account}
          inputMode="email"
          onChangeText={setAccount}
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
          title="Save"
          style={{marginVertical: 44}}
          onPress={() => CheckValue()}
        />
      </PageContainer>
    </SafeAreaView>
  );
};

export default CreateProfile;
