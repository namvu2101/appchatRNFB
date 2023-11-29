import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Alert,
  Keyboard,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, SIZES, FONTS, images} from '../../constants';
import UITextInput from '../../components/UITextInput';
import UIButton from '../../components/UIButton';
import {Button, TextInput} from 'react-native-paper';
import PageContainer from '../../components/PageContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {db} from '../../firebase/firebaseConfig';
import {SocialIcon} from '@rneui/themed';

export default function Login() {
  const navigation = useNavigation();
  const [account, setAccount] = useState('0974046550');
  const [password, setPassword] = useState('123456');
  const [secure, setSecure] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isdisable, setIsdisable] = useState(true);
  const icons_social = ['facebook', 'google', 'twitter'];
  const [hideKeyboard, setHideKeyboard] = useState(true);
  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      setHideKeyboard(true);
    });
    Keyboard.addListener('keyboardDidShow', () => {
      setHideKeyboard(false);
    });
  }, []);

  useEffect(() => {
    setErrorMessage('');
    if (account.length == 0 || password.length == 0) {
      setIsdisable(true);
    } else {
      setIsdisable(false);
    }
  }, [account, password]);

  const checkValue = async () => {
    db.collection('users')
      .where('phone', '==', account)
      .get()
      .then(doc => {
        if (doc.size == 0) {
          setErrorMessage('Lỗi: SĐT chưa được đăng ký');
        } else {
          const user_pass = doc.docs.find(
            item => item.data().password === password,
          );
          if (user_pass) {
            if (user_pass.data().status == false) {
              setErrorMessage('Tài khoản đã bị khóa');
            } else handleLogin(user_pass.id);
          } else {
            setErrorMessage('Lỗi: Mật khẩu không đúng');
          }
        }
      });
  };
  const handleLogin = userId => {
    AsyncStorage.setItem('userId', userId);
    navigation.replace('Splash');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <View style={styles.container}>
          <Text style={{...FONTS.h2, color: COLORS.black, fontWeight: 'bold'}}>
            Đăng nhập Chat VPN
          </Text>
          <Text style={{...FONTS.h3, color: COLORS.black, textAlign: 'center'}}>
            Đăng nhập bằng tài khoản xã hội hoặc tài khoản của bạn
          </Text>
          <View>
            <UITextInput
              title="Số Điện Thoại"
              value={account}
              inputMode="numeric"
              onChangeText={setAccount}
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
            <Button
              textColor={COLORS.red}
              style={{alignItems: 'flex-end'}}
              onPress={() =>
                Alert.alert(
                  'Thông báo !',
                  'Mật khẩu mới sẽ được gửi đến SĐT của bạn',
                )
              }>
              Quên mật khẩu ?
            </Button>
            <Text style={styles._err_mess}>{errorMessage}</Text>
          </View>

          {/* {hideKeyboard && (
            <>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    height: 2,
                    width: '40%',
                    backgroundColor: COLORS.gray,
                  }}
                />
                <Text style={{color: COLORS.black, marginHorizontal: 10}}>
                  Hoặc
                </Text>
                <View
                  style={{
                    height: 2,
                    width: '40%',
                    backgroundColor: COLORS.gray,
                  }}
                />
              </View>
              <Text style={FONTS.h3}>Đăng nhập bằng tài khoản</Text>
              <View style={styles._social}>
                {icons_social.map(item => (
                  <SocialIcon
                    underlayColor="white"
                    key={item}
                    type={item}
                    onPress={() =>
                      Alert.alert(
                        'Thông báo !',
                        'Tài khoản chưa liên kết với tài khoản xã hội',
                      )
                    }
                  />
                ))}
              </View>
            </>
          )} */}

          <UIButton
            title="Đăng nhập"
            disabled={isdisable}
            onPress={() => checkValue()}
          />
          <Button
            textColor={COLORS.red}
            onPress={() => navigation.navigate('PhoneNumber', 'signup')}>
            Bạn chưa có tài khoản ? Đăng ký tại đây
          </Button>
        </View>
      </PageContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    paddingHorizontal: 22,
  },
  _social: {
    flexDirection: 'row',
    height: 60,
    width: SIZES.width * 0.6,
    justifyContent: 'space-around',
  },
  _social_ic: {
    height: 60,
    width: 60,
    borderColor: COLORS.black,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  _image_ic: {
    height: 50,
    width: 50,
    borderColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  _err_mess: {
    ...FONTS.h4,
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
