import React, {useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
  Image,
  Keyboard,
} from 'react-native';
import {Avatar, Button, TextInput} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SIZES, images, FONTS, COLORS} from '../../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import {profileStore} from '../../store';
import {db, storage} from '../../firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UIModals from '../../components/UIModals';
import ListAvatar from '../../components/ListAvatar';
import {handlePickImage} from '../../components/ImagePicker';
import uuid from 'react-native-uuid';
import Loading from '../../components/Loading';
import DatePicker from 'react-native-date-picker';

export default function UserProfile() {
  const navigation = useNavigation();
  const {profile} = profileStore();
  const [isVisible, setisVisible] = React.useState(false);
  const [image, setImage] = useState(profile.image);
  const [type, setType] = useState('');
  const [date, setDate] = useState(new Date());
  const [newDate, setnewDate] = useState(
    profile.date ? profile.date : 'Thêm ngày sinh',
  );
  const [isLoading, setIsLoading] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    console.log(profile.date);
  }, []);
  const list = [
    {
      name: 'Display Name',
      value: profile.name,
      editable: false,
      inputMode: 'text',
    },
    {
      name: 'Email Address',
      value: profile?.email || 'Thêm email mới',
      editable: false,
      inputMode: 'email',
    },
    {
      name: 'Address',
      value: profile?.add || 'Thêm địa chỉ',
      editable: false,
      inputMode: 'text',
    },
    {
      name: 'Phone Number',
      value: profile.phone,
      editable: false,
      inputMode: 'numeric',
    },
  ];
  const [profileFields, setProfileFields] = useState(list);
  const onClose = () => {
    setisVisible(false);
  };
  const handleFieldChange = (index, newValue) => {
    const updatedFields = [...profileFields];
    updatedFields[index].value = newValue;
    setProfileFields(updatedFields);
  };

  const toggleEdit = index => {
    const updatedFields = [...profileFields];
    updatedFields[index].editable = !updatedFields[index].editable;
    setProfileFields(updatedFields);
  };
  const handleUpdate = async () => {
    const idImage = uuid.v4();
    const userId = await AsyncStorage.getItem('userId');
    const docRef = db.collection('users').doc(userId);
    try {
      setIsLoading(true);
      const reference = storage().ref(`users/Avatar/${idImage}`);
      const avatarUrl = image.includes('http')
        ? image
        : await uploadImage(reference, image);
      docRef
        .update({
          image: avatarUrl,
          name: profileFields[0].value,
          email: profileFields[1].value,
          add: profileFields[2].value,
          phone: profileFields[3].value,
          date: newDate,
        })
        .then(() => {
          setIsLoading(false);
          Alert.alert('Thông báo', 'Cập nhật thành công');
        });
    } catch (error) {
      console.log(error);
    }
  };
  const uploadImage = async (reference, image) => {
    await reference.putFile(image);
    return await reference.getDownloadURL();
  };

  const onBackButton = () => {
    if (
      list[0].value != profileFields[0].value ||
      list[1].value != profileFields[1].value ||
      list[2].value != profileFields[2].value ||
      list[3].value != profileFields[3].value ||
      profile.image != image ||
      profile.date != newDate
    ) {
      Alert.alert('Thông báo!', 'Bạn có muốn lưu thay đổi ?', [
        {
          text: 'Lưu',
          onPress: async () => {
            await handleUpdate();
          },
        },
        {
          text: 'Hủy',
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      navigation.goBack();
    }
  };
  const ChangeAvatar = async () => {
    const avatar = await handlePickImage();
    setisVisible(false);
    setImage(avatar);
  };

  const updateDateofBirth = () => {
    const dateFormat = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    setnewDate(dateFormat);
    onClose();
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <View style={{flex: 1}}>
          <Image
            source={{
              uri: 'https://th.bing.com/th/id/R.31a057b002e52be3a87c1554ab0df61f?rik=pUq4kE2yAahmbg&riu=http%3a%2f%2f4.bp.blogspot.com%2f-cFrX94jbehk%2fUQgQyh66j3I%2fAAAAAAAAAk4%2fqFaJ1jjlMV8%2fs1600%2f9b516f4441a7bfb5174b33ebf74fc1d6_49102622.freebackgrounds5.jpg&ehk=Koj52Q69rFc9d4z9WglpPOi%2fpBSpUT3sFBd9r1fhnok%3d&risl=&pid=ImgRaw&r=0]',
            }}
            style={{width: SIZES.width, height: '33%', position: 'absolute'}}
            resizeMode="cover"
          />
          <View style={styles.header}>
            <Pressable onPress={onBackButton}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={26}
                color="#FFFFFF"
              />
            </Pressable>
            <Pressable onPress={handleUpdate}>
              <MaterialCommunityIcons
                name="content-save-check-outline"
                size={30}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
          <Pressable
            onPress={() => {
              setType('Avatar');
              setisVisible(true);
            }}
            style={styles.profileSection}>
            <Avatar.Image
              source={{uri: image || images.imageLoading}}
              size={80}
            />
          </Pressable>
          <Text style={styles.text}>{profile.name}</Text>
          <Text style={styles.text}>{profile.email}</Text>
          <View style={styles.profileForm}>
            <ScrollView style={styles.formScroll}>
              {profileFields.map((field, index) => (
                <View key={index}>
                  <Text style={{...FONTS.h4, color: COLORS.secondaryGray}}>
                    {field.name}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextInput
                      disabled={!field.editable}
                      value={field.value}
                      mode="outlined"
                      inputMode={field.inputMode}
                      onChangeText={newValue =>
                        handleFieldChange(index, newValue)
                      }
                      style={{
                        flex: 1,
                        backgroundColor: field.editable ? '#FFFFFF' : '#FAFAFA',
                      }}
                      textColor="#000000"
                    />

                    <Pressable
                      onPress={() => {
                        toggleEdit(index);
                      }}>
                      <MaterialCommunityIcons
                        name={
                          field.editable
                            ? 'check-circle-outline'
                            : 'pencil-outline'
                        }
                        size={30}
                        color="red"
                      />
                    </Pressable>
                  </View>
                </View>
              ))}
              <Text style={{...FONTS.h4, color: COLORS.secondaryGray}}>
                Date of Birth
              </Text>
              <Pressable
                style={{
                  height: 44,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setType('Date_of_birth');
                  setisVisible(true);
                }}>
                <Text
                  style={{
                    ...FONTS.h4,
                    paddingHorizontal: 15,
                    borderColor: '#000',
                    height: '100%',
                    borderWidth: 1,
                    textAlignVertical: 'center',
                  }}>
                  {newDate}
                </Text>
                <MaterialCommunityIcons
                  name={'calendar'}
                  size={30}
                  color="black"
                />
              </Pressable>

              <View style={styles.mediaShared}>
                <Text>Media Shared</Text>
              </View>
            </ScrollView>
          </View>
        </View>
        <Loading isVisible={isLoading} />
        <UIModals isVisible={isVisible} onClose={onClose}>
          {type === 'Date_of_birth' ? (
            <View
              style={{
                backgroundColor: '#fff',
                alignItems: 'center',
                paddingVertical: 20,
              }}>
              <DatePicker
                textColor="black"
                mode="date"
                locale="vn"
                date={date}
                onDateChange={setDate}
                androidVariant="nativeAndroid"
                onConfirm={date => {
                  setDate(date);
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'flex-end',
                }}>
                <Button textColor="#2C6BED" onPress={onClose}>
                  Cancel
                </Button>
                <Button textColor="#2C6BED" onPress={updateDateofBirth}>
                  Ok
                </Button>
              </View>
            </View>
          ) : (
            <View
              style={{
                height: 300,
                backgroundColor: 'white',
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              <Button mode="contained" onPress={ChangeAvatar}>
                Chọn từ thư viện
              </Button>
              <ListAvatar
                isVisible={isVisible}
                onClose={onClose}
                setImage={setImage}
              />
            </View>
          )}
        </UIModals>
      </PageContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  backButton: {
    width: SIZES.width,
    height: 50,
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
  },
  profileForm: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: SIZES.width,
    marginTop: 20,
    flex: 1,
    paddingTop: 20,
  },
  formScroll: {
    marginHorizontal: 20,
    flex: 1,
  },

  mediaShared: {
    color: '#000',
    height: 300,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 22,
    justifyContent: 'space-between',
  },
  text: {...FONTS.h3, color: COLORS.white, textAlign: 'center'},
});
