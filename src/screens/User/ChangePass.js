import {StyleSheet, Text, View, Pressable, Alert} from 'react-native';
import React, {useLayoutEffect, useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import {useNavigation} from '@react-navigation/native';
import UITextInput from '../../components/UITextInput';
import {Button, TextInput} from 'react-native-paper';
import {COLORS, FONTS} from '../../constants';
import UIButton from '../../components/UIButton';
import {db} from '../../firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../../components/Loading';

export default function ChangePass() {
  const navigation = useNavigation();
  const [isdisable, setIsdisable] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setisLoading] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Đổi mật khẩu',
    });
  }, []);

  const listField = [
    {
      title: 'Mật khẩu cũ',
      value: '',
      secure: true,
    },
    {
      title: 'Mật khẩu mới',
      value: '',
      secure: true,
    },
    {
      title: 'Nhập lại mật khẩu mới',
      value: '',
      secure: true,
    },
  ];
  const [passwordField, setPasswordField] = useState(listField);

  const handleChangeValue = (index, newValue) => {
    const updatedFields = [...passwordField];
    updatedFields[index].value = newValue;
    setPasswordField(updatedFields);
  };
  const toggleSecure = index => {
    const updatedFields = [...passwordField];
    updatedFields[index].secure = !updatedFields[index].secure;
    setPasswordField(updatedFields);
  };
  useEffect(() => {
    setErrorMessage('');
    if (
      passwordField[0].value.length == 0 ||
      passwordField[1].value.length == 0 ||
      passwordField[2].value.length == 0
    ) {
      setIsdisable(true);
    } else {
      setIsdisable(false);
    }
  }, [passwordField]);
  const checkValue = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const res = await db
      .collection('users')
      .doc(userId)
      .get()
      .then(user => user.data().password);
    if (passwordField[0].value != res) {
      handleChangeValue(0, '');
      setErrorMessage('Sai mật khẩu');
    } else if (passwordField[1].value.length < 6) {
      setErrorMessage('Mật khẩu mới phải lớn hơn 6 kí tự');
    } else if (passwordField[1].value != passwordField[2].value) {
      setErrorMessage('Xác nhận mật khẩu không khớp');
    } else if (res == passwordField[1].value) {
      handleChangeValue(1, '');
      setErrorMessage('Mật khẩu bạn đã sử trước đó');
    } else {
      setisLoading(true);
      db.collection('users')
        .doc(userId)
        .update({password: passwordField[1].value})
        .then(() => {
          setisLoading(false);
          Alert.alert('Thông báo', 'Thay đổi mật khẩu thành công', [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]);
        });
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer style={{justifyContent: 'center'}}>
        <Text style={{...FONTS.h3, marginBottom: 40}}>
          Thay đổi mật khẩu của bạn
        </Text>
        {passwordField.map((field, index) => (
          <UITextInput
            key={index}
            title={field.title}
            value={field.value}
            onChangeText={text => {
              handleChangeValue(index, text);
            }}
            secure={field.secure}
            right={
              <TextInput.Icon
                onPress={() => toggleSecure(index)}
                icon={field.secure ? 'eye-off' : 'eye'}
                color={COLORS.black}
              />
            }
          />
        ))}
        <Text
          style={{
            ...FONTS.h4,
            color: 'red',
            textAlign: 'center',
          }}>
          {errorMessage}
        </Text>
        <Pressable
          onPress={() => navigation.replace('PhoneNumber', 'changepass')}>
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.primary,
              textAlign: 'right',
              marginVertical: 10,
            }}>
            Quên mật khẩu ?
          </Text>
        </Pressable>
        <UIButton
          title="Thay đổi"
          disabled={isdisable}
          onPress={() => checkValue()}
        />
        <Loading isVisible={isLoading} />
      </PageContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
