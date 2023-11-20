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

import {handlePickImage} from '../../components/ImagePicker';

import Loading from '../Dialog/Loading';
import {CheckBox, Dialog, ListItem} from '@rneui/themed';
import DatePick from '../Dialog/Date';
import ListAvatar from '../../components/ListAvatar';
import {getFiles} from './actions';

export default function UserProfile() {
  const navigation = useNavigation();
  const {profile, updateProfile} = profileStore();
  const [image, setImage] = useState(profile.image);
  const [date, setDate] = useState(new Date());
  const [isVisible, setisVisible] = React.useState(false);
  const [selectedSex, setSex] = React.useState(0);
  const [files, setFiles] = useState([]);
  const [imageBG, setImageBG] = useState(
    profile?.backgroundImage || images.imageBackground,
  );
  const [newDate, setnewDate] = useState(
    profile.date ? profile.date : 'Chưa cập nhật',
  );
  const [type, settype] = useState('');
  const {userId} = authStore();
  const docRef = db.collection('users').doc(userId);
  const [isLoading, setIsLoading] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    getFiles(userId, data => {
      setFiles(data);
    });
  }, []);

  const ChangeImage = async type => {
    try {
      const chooseImage = await handlePickImage();
      if (chooseImage === 'Error') {
        return; // Handle the error or exit the function
      }
      setIsLoading(true);
      const {uri: imageUri, fileName} = chooseImage;
      if (type === 'avatar') {
        profile.image = imageUri;
        setImage(imageUri);
        const newImage = await uploadImage(fileName, imageUri);
        await docRef
          .update({image: newImage})
          .then(() =>
            Alert.alert('Thông báo !', 'Cập nhật ảnh đại diện thành công'),
          );
        setIsLoading(false);
      } else {
        profile.backgroundImage = imageUri;
        setImageBG(imageUri);
        const newBG = await uploadImage(fileName, imageUri);
        await docRef
          .update({backgroundImage: newBG})
          .then(() =>
            Alert.alert('Thông báo !', 'Cập nhật ảnh bìa thành công'),
          );
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Có lỗi xảy ra', error);
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

  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <Pressable
          onPress={() => {
            settype('background');
            setisVisible(true);
          }}
          style={styles._backgroundImage}>
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
            settype('avatar');
            setisVisible(true);
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
              Thông tin khác
            </Text>
            <View style={styles._infor}>
              <Button
                onPress={() => {
                  settype('date');
                  setisVisible(true);
                }}
                icon="calendar"
                mode="text"
                contentStyle={{
                  flexDirection: 'row-reverse',
                }}
                textColor="black">
                {newDate}
              </Button>
              <Button
                onPress={() => {
                  settype('sex');
                  setisVisible(true);
                }}
                icon={profile.sex == 'Nam' ? 'gender-female' : 'gender-male'}
                mode="text"
                contentStyle={{
                  flexDirection: 'row-reverse',
                }}
                textColor="black">
                Giới tính: {profile.sex}
              </Button>
            </View>

            <Text style={{...FONTS.h4, color: COLORS.secondaryGray}}>
              Files Phương Tiện
            </Text>
            <View style={styles.mediaShared}>
              {files.map(f => (
                <Pressable
                  key={f}
                  onPress={() =>
                    navigation.navigate('MediaScreen', {
                      uri: f,
                      mediaType: 'photo',
                    })
                  }>
                  <Image source={{uri: f}} style={styles._files} />
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
        <Loading isVisible={isLoading} />
        <Dialog isVisible={isVisible} onBackdropPress={onClose}>
          <Dialog.Title
            title={
              type == 'sex'
                ? 'Chọn giới tính'
                : type == 'date'
                ? 'Chọn ngày sinh'
                : 'Chọn ảnh đại diện'
            }
            titleStyle={{color: 'black'}}
          />
          {type == 'date' ? (
            <DatePick setnewDate={setnewDate} onClose={onClose} />
          ) : type == 'sex' ? (
            <>
              {sexs.map(l => (
                <View
                  key={l}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
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
                  setisVisible(false);
                }}>
                Lưu
              </Button>
            </>
          ) : (
            <View style={{alignItems: 'center', height: 365}}>
              <Button
                mode="contained"
                textColor="white"
                onPress={() => {
                  if (type == 'avatar') {
                    ChangeImage('avatar');
                  } else {
                    ChangeImage('background');
                  }
                  setisVisible(false);
                }}>
                Chọn từ thư viện
              </Button>
              <Text style={{...FONTS.h4, color: COLORS.secondaryGray}}>
                Files Phương Tiện của bạn
              </Text>
              <ListAvatar
                setLoading={setIsLoading}
                docRef={docRef}
                setImage={type == 'avatar' ? setImage : setImageBG}
                onClose={onClose}
                data={files}
                type={type}
              />
            </View>
          )}
        </Dialog>
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
  _backgroundImage: {
    width: SIZES.width,
    height: SIZES.height / 3,
    position: 'absolute',
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    justifyContent: 'center',
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
  _infor: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    justifyContent: 'space-around',
  },
  _files: {height: 90, width: 90, margin: 5, borderRadius: 8},
});
