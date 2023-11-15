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
import {Avatar, Button, Icon, TextInput} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SIZES, images, FONTS, COLORS} from '../../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import {authStore, profileStore} from '../../store';
import {db, storage} from '../../firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UIModals from '../../components/UIModals';
import ListAvatar from '../../components/ListAvatar';
import {handlePickImage} from '../../components/ImagePicker';
import uuid from 'react-native-uuid';
import DatePicker from 'react-native-date-picker';
import Loading from '../Dialog/Loading';
import {CheckBox, Dialog, ListItem} from '@rneui/themed';

export default function UserProfile() {
  const navigation = useNavigation();
  const {profile, updateProfile} = profileStore();
  const [isVisible, setisVisible] = React.useState(false);
  const [image, setImage] = useState(profile.image);
  const [date, setDate] = useState(new Date());
  const [isVisible6, setisVisible6] = React.useState(false);
  const [selectedSex, setSex] = React.useState(0);
  const [imageBG, setImageBG] = useState(
    profile?.backgroundImage || images.imageBackground,
  );
  const [newDate, setnewDate] = useState(
    profile.date ? profile.date : 'Chưa cập nhật',
  );
  const {userId} = authStore();
  const docRef = db.collection('users').doc(userId);

  const [isLoading, setIsLoading] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const ChangImage = async type => {
    const chooseImage = await handlePickImage();

    if (chooseImage === 'Error') {
      return; // Handle the error or exit the function
    }

    const {uri: imageUri, fileName} = chooseImage;

    if (type === 'avatar') {
      profile.image = imageUri;
      setImage(imageUri);
      const newImage = await uploadImage(fileName, imageUri);
      await docRef.update({image: newImage});
    } else {
      profile.backgroundImage = imageUri;
      setImageBG(imageUri);
      const newBG = await uploadImage(fileName, imageUri);
      await docRef.update({backgroundImage: newBG});
    }
  };

  const list = [
    {
      name: 'Tên hiển thị',
      value: profile.name,
      editable: false,
      inputMode: 'text',
    },
    {
      name: 'Địa chỉ email',
      value: profile?.email || 'Chưa cập nhật email',
      editable: false,
      inputMode: 'email',
    },
    {
      name: 'Địa chỉ',
      value: profile?.add || 'Chưa cập nhật địa chỉ',
      editable: false,
      inputMode: 'text',
    },
    {
      name: 'SĐT đăng ký',
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
    const newProfile = {
      name: profileFields[0].value,
      email: profileFields[1].value,
      add: profileFields[2].value,
      phone: profileFields[3].value,
      date: newDate,
      sex: profile.sex,
    };
    try {
      setIsLoading(true);
      Object.assign(profile, newProfile);
      await docRef.update(newProfile).then(() => {
        setIsLoading(false);
        Alert.alert('Thông báo', 'Cập nhật thành công');
      });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  const uploadImage = async (name, uri) => {
    const reference = storage().ref(`Users/${userId}/Files/${name}`);
    await reference.putFile(uri);
    return await reference.getDownloadURL();
  };

  const onBackButton = () => {
    if (
      list[0].value != profileFields[0].value ||
      list[1].value != profileFields[1].value ||
      list[2].value != profileFields[2].value ||
      list[3].value != profileFields[3].value ||
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
        <Pressable
          onPress={() => ChangImage('backgroud')}
          style={{
            width: SIZES.width,
            height: SIZES.height / 3,
            position: 'absolute',
          }}>
          <Image
            source={{
              uri: imageBG,
            }}
            style={{width: '100%', height: '100%'}}
            resizeMode="cover"
          />
        </Pressable>
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
            ChangImage('avatar');
          }}
          style={styles.profileSection}>
          <Avatar.Image
            source={{uri: image || images.imageLoading}}
            size={80}
          />
          <View style={{position: 'absolute'}}>
            <Icon source={'camera'} size={20} color="white" />
          </View>
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
              Ngày sinh
            </Text>
            <Pressable
              style={{
                height: 44,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => {
                setisVisible(true);
              }}>
              <Text
                style={{
                  ...FONTS.h4,
                  paddingHorizontal: 15,
                  height: '100%',
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
            <Text style={{...FONTS.h4, color: COLORS.secondaryGray}}>
              Giới tính
            </Text>
            <Pressable
              style={{
                height: 44,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => {
                setisVisible6(true);
              }}>
              <Text
                style={{
                  ...FONTS.h4,
                  paddingHorizontal: 15,
                  height: '100%',
                  textAlignVertical: 'center',
                }}>
                {profile.sex}
              </Text>
              <MaterialCommunityIcons name={'pencil'} size={30} color="black" />
            </Pressable>
            <View style={styles.mediaShared}>
              <Text>Media Shared</Text>
            </View>
          </ScrollView>
        </View>
        <Loading isVisible={isLoading} />
        <Dialog
          isVisible={isVisible6}
          onBackdropPress={() => setisVisible6(false)}>
          <Dialog.Title title="Chọn giới tính" titleStyle={{color: 'black'}} />
          {sexs.map(l => (
            <View key={l} style={{flexDirection: 'row', alignItems: 'center'}}>
              <CheckBox
                checked={selectedSex === l}
                onPress={() => setSex(l)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
              />
              <Text style={FONTS.h3}>{l}</Text>
            </View>
          ))}
          <Button
            textColor="#2C6BED"
            onPress={() => {
              profile.sex = selectedSex;
              setisVisible6(false);
            }}>
            Lưu
          </Button>
        </Dialog>
        <UIModals isVisible={isVisible} onClose={onClose}>
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
                Hủy
              </Button>
              <Button textColor="#2C6BED" onPress={updateDateofBirth}>
                Lưu
              </Button>
            </View>
          </View>
        </UIModals>
      </PageContainer>
    </SafeAreaView>
  );
}
const sexs = ['Nam', 'Nữ', 'Khác'];
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
    justifyContent: 'flex-end',
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
    paddingHorizontal: 22,
    justifyContent: 'space-between',
    width: SIZES.width,
  },
  text: {...FONTS.h3, color: COLORS.white, textAlign: 'center'},
});
