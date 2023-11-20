import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import {useNavigation} from '@react-navigation/native';
import UITextInput from '../../components/UITextInput';
import {Avatar, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES, images} from '../../constants';
import {handlePickImage} from '../../components/ImagePicker';
import UIButton from '../../components/UIButton';
import uuid from 'react-native-uuid';
import {db, storage, timestamp} from '../../firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../Dialog/Loading';

export default function Createinformation({route}) {
  const navigation = useNavigation();
  const member = route.params;
  const [image, setImage] = useState('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState();
  useLayoutEffect(() => {
    navigation.setOptions({headerTitle: 'Thông tin nhóm trò chuyện'});
  }, []);
  const ChangeAvatar = async () => {
    const avatar = await handlePickImage();
    if (avatar != 'Error') {
      setImage(avatar.uri);
      setPhoto(avatar);
    }
  };
  const handleCreate = async () => {
    const docRef = db.collection('Conversations');
    const userId = await AsyncStorage.getItem('userId');
    if (input.length == 0) {
      Alert.alert('Thông báo !', 'Chưa nhập tên nhóm');
    } else if (image.length == 0) {
      Alert.alert('Thông báo !', 'Chưa chọn ảnh nhóm');
    } else {
      const member_id = member.map(i => i.id);
      try {
        setIsLoading(true);
        member_id.push(userId);
        const reference = storage().ref(
          `Conversations/Group/files/${photo.fileName}`,
        );
        const avatar = await uploadImage(reference, image);
        docRef
          .add({
            type: 'Group',
            name: input,
            image: avatar,
            last_message: timestamp,
            messageText: '',
            create_id: userId,
            member_id: member_id,
            read: 'id da xem',
            isOnline: true,
            admin: [userId],
          })
          .then(async doc => {
            Alert.alert('Thông báo !', 'Tạo nhóm thành công', [
              {
                text: 'OK',
                onPress: () => {
                  setIsLoading(false);
                  navigation.replace('BottomTabs');
                },
              },
            ]);
            // addConversation(member_id, doc.id);
          });
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }
  };
  const uploadImage = async (reference, image) => {
    await reference.putFile(image);
    return await reference.getDownloadURL();
  };

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          marginHorizontal: 5,
          alignItems: 'center',
          marginVertical: 10,
        }}>
        <View
          style={{
            borderColor: COLORS.primary,
            height: 60,
            width: 60,
            borderRadius: 30,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Avatar.Image
            source={{uri: item.data.image || images.imageLoading}}
            size={50}
          />
        </View>
        <Text
          style={{...FONTS.h4, textAlign: 'center', width: 60}}
          numberOfLines={1}>
          {item.data.name}
        </Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <View
          style={{
            backgroundColor: '#fff',
            padding: 22,
            marginHorizontal: 22,
            alignItems: 'center',
          }}>
          <View style={styles.avatarContainer}>
            {image.length != 0 ? (
              <Avatar.Image
                source={{uri: image || images.imageLoading}}
                size={95}
              />
            ) : (
              <Icon
                name="person-circle-outline"
                size={95}
                color={COLORS.black}
              />
            )}
          </View>
          <View style={styles.buttonContainer}>
            <Button
              textColor="#FFFFFF"
              buttonColor={COLORS.primary}
              onPress={ChangeAvatar}>
              Chọn ảnh
            </Button>
            <Button
              textColor="#FFFFFF"
              buttonColor={COLORS.primary}
              onPress={() => setImage('')}>
              Xóa ảnh
            </Button>
          </View>

          <Text style={{...FONTS.h3, marginVertical: 10}}>
            Đặt tên cho đoạn chat mới
          </Text>
          <UITextInput
            style={{height: 44}}
            placeholder="Tên nhóm (Bắt buộc)"
            value={input}
            onChangeText={setInput}
            onSubmit={() => handleCreate()}
          />
          <View style={{width: SIZES.width}}>
            <Text style={{...FONTS.h3, marginVertical: 10}}>
              Thành viên : {member.length}
            </Text>
            <FlatList data={member} renderItem={renderItem} horizontal />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            <UIButton onPress={() => handleCreate()} title="Tạo nhóm" />
          </View>
        </View>
      </PageContainer>
      <Loading isVisible={isLoading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    width: 100,
    height: 100,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    width: SIZES.width * 0.5,
    justifyContent: 'space-between',
  },
});
