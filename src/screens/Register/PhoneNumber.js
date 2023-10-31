import {useEffect, useLayoutEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {images, COLORS, SIZES, FONTS} from '../../constants';
import UIButton from '../../components/UIButton';
import UITextInput from '../../components/UITextInput';
import {Button} from 'react-native-paper';
import PageContainer from '../../components/PageContainer';
import UIModals from '../../components/UIModals';
import {flagcode} from '../../constants/flagCode';
import {auth, db} from '../../firebase/firebaseConfig';
import {validatePhoneNumber} from '../../constants/validate';

export default function PhoneNumber({navigation, route}) {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [visible, setVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isdisable, setIsdisable] = useState(true);
  const action = route.params;
  console.log(action);
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
        setErrorMessage('SDT da dc su dung');
      } else {
        navigation.replace('CreateProfile', phoneNumber);
      }
    } else {
      setErrorMessage('Lỗi: ' + validationResult);
    }
  };
  // render countries codes modal
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
  const onClose = () => {
    setVisible(false);
    setVerificationCode('');
  };
  const handleSend = async () => {
    // navigation.replace('CreateProfile', phoneNumber);
    const phone = selectedArea.callingCode + phoneNumber;
    const confirm = await auth()
      .verifyPhoneNumber(phone)
      .then(verificationId => {
        console.log('Mã xác thực đã được gửi đi.');
      })
      .catch(e => console.log(e));
    setConfirmation(confirm);
    setVisible(true);
  };
  const confirmCode = async () => {
    try {
      await confirmation.confirm(verificationCode);
      onClose();
      navigation.replace('CreateProfile', phoneNumber);
    } catch (error) {
      setVerificationCode('');
      console.error('Xác thực thất bại: ', error);
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            paddingHorizontal: 22,
            paddingVertical: 44,
          }}>
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
              style={{
                width: 100,
                height: 48,
                marginHorizontal: 5,
                borderRadius: SIZES.padding,
                borderColor: COLORS.secondaryWhite,
                borderWidth: 1,
                backgroundColor: COLORS.secondaryWhite,
                flexDirection: 'row',
                fontSize: 12,
              }}
              onPress={() => setModalVisible(true)}>
              <View style={{justifyContent: 'center'}}>
                <Image
                  source={images.down}
                  style={{
                    width: 10,
                    height: 10,
                    tintColor: COLORS.black,
                  }}
                />
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  marginLeft: 5,
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
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  marginLeft: 5,
                }}>
                <Text style={{color: '#111', fontSize: 12}}>
                  {selectedArea?.callingCode}
                </Text>
              </View>
            </TouchableOpacity>
            {/* Phone Number Text Input */}

            <UITextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              style={{
                flex: 1,
                marginVertical: 10,
                borderColor: '#111',
                backgroundColor: COLORS.secondaryWhite,
                borderRadius: SIZES.padding,
                paddingLeft: SIZES.padding,
                height: 48,
                fontSize: 12,
                color: '#111',
              }}
              placeholder="Nhập SĐT của bạn"
              placeholderTextColor={COLORS.secondaryGray}
              inputMode="numeric"
            />
          </View>
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
      <UIModals isVisible={visible} onClose={onClose}>
        <View
          style={{
            backgroundColor: '#fff',
            justifyContent: 'center',
            height: SIZES.height * 0.2,
            alignItems: 'center',
          }}>
          <UITextInput
            title="Nhập mã code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            style={{textAlign: 'center'}}
            inputMode="numeric"
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 15,
              width: '100%',
            }}>
            <Button textColor={COLORS.primary} onPress={handleSend}>
              Gửi lại
            </Button>
            <Button textColor={COLORS.primary} onPress={confirmCode}>
              Xác nhận
            </Button>
          </View>
        </View>
      </UIModals>
      {renderAreasCodesModal()}
    </SafeAreaView>
  );
}
