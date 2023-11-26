import {useEffect, useLayoutEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import {TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {images, COLORS, SIZES, FONTS} from '../../constants';
import UIButton from '../../components/UIButton';
import UITextInput from '../../components/UITextInput';
import {Button, Icon} from 'react-native-paper';
import PageContainer from '../../components/PageContainer';
import {flagcode} from '../../constants/flagCode';
import {auth, db} from '../../firebase/firebaseConfig';
import {validatePhoneNumber} from '../../constants/validate';
import {Dialog} from '@rneui/themed';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import OTP_input from '../Dialog/OTP_input';

export default function PhoneNumber({navigation, route}) {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [otp, setOtp] = useState(654321);
  const [code, setCode] = useState(123456);
  const [visible, setVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isdisable, setIsdisable] = useState(true);
  const action = route.params;
  useLayoutEffect(() => {
    let areaData = flagcode.map(item => {
      return {
        code: item.alpha2Code,
        item: item.name,
        callingCode: `+${item.callingCodes[0]}`,
        flag: `https://flagsapi.com/${item.alpha2Code}/flat/64.png`, // https://flagsapi.com/${item.alpha2Code}/flat/64.png
      };
    });
    setAreas(areaData);
    if (areaData.length > 0) {
      let defaultData = areaData.filter(a => a.code == 'VN');

      if (defaultData.length > 0) {
        setSelectedArea(defaultData[0]);
      }
    }
    navigation.setOptions({
      headerTitle: 'Nhập Số điện thoại',
    });
  }, []);
  useEffect(() => {
    setErrorMessage('');
    if (phoneNumber.length == 0) {
      setIsdisable(true);
    } else {
      setIsdisable(false);
    }
  }, [phoneNumber]);

  const checkPhonenumber = async () => {
    const validationResult = validatePhoneNumber(phoneNumber);
    if (validationResult === null) {
      const resp = await db.collection('users').get();
      const user = resp.docs.find(item => item.data().phone == phoneNumber);
      if (user) {
        setErrorMessage('SDT đã được sử dụng');
      } else {
        Alert.alert('Thông báo', 'Hệ thống đang gửi mã xác nhận', [
          {text: 'Nhập mã', onPress: () => handleSend()},
        ]);
      }
    } else {
      setErrorMessage('Lỗi: ' + validationResult);
    }
  };

  const onClose = () => {
    setVisible(false);
    setOtp('');
  };
  const handleSend = async () => {
    setVisible(true);

    const phone = selectedArea.callingCode + phoneNumber;
    await auth()
      .verifyPhoneNumber(phone)
      .then(verificationId => {
        setCode(verificationId.code);
      })
      .catch(e => {
        Alert.alert(
          'Thông báo',
          'Không thể lấy mã xác thực vui lòng thử lại sau',
        );
        console.error(e);
      });
  };
  const confirmCode = async () => {
    try {
      if (code == otp) {
        onClose();
        navigation.replace('CreateProfile', phoneNumber);
      } else {
        Alert.alert('Thông báo', 'Mã xác thực không đúng');
      }
    } catch (error) {
      setOtp('');
      Alert.alert('Thông báo', 'Xác thực thất bại');
      console.error('Xác thực thất bại: ', error);
    }
  };

  function renderAreasCodesModal() {
    const renderItem = ({item}) => {
      return (
        <TouchableOpacity
          style={{
            padding: 10,
            flexDirection: 'row',
          }}
          onPress={() => {
            setSelectedArea(item), setModalVisible(false);
          }}>
          <Image
            source={{uri: item.flag}}
            style={{
              height: 30,
              width: 30,
              marginRight: 10,
            }}
          />

          <Text style={{...FONTS.body3, color: COLORS.white}}>{item.item}</Text>
        </TouchableOpacity>
      );
    };

    return (
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                height: 400,
                width: SIZES.width * 0.8,
                color: '#fff',
                backgroundColor: '#342342',
                borderRadius: 12,
              }}>
              <FlatList
                data={areas}
                renderItem={renderItem}
                keyExtractor={item => item.code}
                verticalScrollIndicator={false}
                style={{
                  padding: 20,
                  marginBottom: 20,
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <View style={styles._container}>
          <Text
            style={{
              ...FONTS.h2,
              color: COLORS.black,
              textAlign: 'center',
            }}>
            Nhập SĐT đăng ký
          </Text>
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.black,
              textAlign: 'center',
              marginVertical: 44,
            }}>
            Hãy chọn mã quốc gia và nhập SĐT của bạn vào bên dưới
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={styles._flag}
              onPress={() => setModalVisible(true)}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 5,
                }}>
                <Image
                  source={{
                    uri:
                      selectedArea?.flag ||
                      'https://flagsapi.com/VN/flat/64.png',
                  }}
                  resizeMode="contain"
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
                <Text style={{...FONTS.h4}}>{selectedArea?.callingCode}</Text>
                <Icon source={'chevron-down'} size={25} color="black" />
              </View>
            </TouchableOpacity>

            <UITextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              style={styles._input_phone}
              placeholder="Nhập SĐT của bạn"
              placeholderTextColor={COLORS.secondaryGray}
              inputMode="numeric"
              onSubmit={checkPhonenumber}
            />
          </View>
          <Text style={styles._txt_error}>{errorMessage}</Text>
          <UIButton
            disabled={isdisable}
            title="Lấy mã"
            onPress={() => {
              switch (action) {
                case 'changepass':
                  handleSend();
                  break;
                default:
                  checkPhonenumber();
                  break;
              }
            }}
          />
        </View>
      </PageContainer>

      <Modal isVisible={visible} onBackButtonPress={onClose}>
        <OTP_input
          setOtp={setOtp}
          handleSend={handleSend}
          confirmCode={confirmCode}
        />
      </Modal>
      {renderAreasCodesModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  _container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 44,
  },
  _confirmCode: {
    backgroundColor: '#fff',
    height: SIZES.height / 4,
    alignItems: 'center',
    paddingVertical: 10,
  },
  _btn_confirm: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    width: '100%',
  },
  _txt_error: {
    ...FONTS.h4,
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  _flag: {
    width: 100,
    height: 48,
    marginHorizontal: 5,
    borderRadius: SIZES.padding,
    borderColor: COLORS.secondaryWhite,
    borderWidth: 1,
    backgroundColor: COLORS.secondaryWhite,
    flexDirection: 'row',
    fontSize: 12,
  },
  _input_phone: {
    flex: 1,
    marginVertical: 10,
    borderColor: '#111',
    backgroundColor: COLORS.secondaryWhite,
    borderRadius: SIZES.padding,
    paddingLeft: SIZES.padding,
    height: 48,
    fontSize: 16,
    color: '#111',
  },
  otpInput: {
    height: 50,
  },
});
