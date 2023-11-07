import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import UITextInput from '../../components/UITextInput';
import {Button} from 'react-native-paper';
import {handlePickImage} from '../../components/ImagePicker';
import uuid from 'react-native-uuid';
import Loading from '../../components/Loading';
import {db} from '../../firebase/firebaseConfig';
export default function createGroup({onHide, member}) {
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');

  const ChangeAvatar = async () => {
    const avatar = await handlePickImage();
    if (avatar != 'Error') {
      setImage(avatar);
    }
  };
  const handleCreate = async input => {
    const idImage = uuid.v4();
    const docRef = db.collection('Conversations');
    if (input.length == 0) {
      Alert.alert('Thông báo !', 'Chưa nhập tên nhóm');
    } else if (image.length == 0) {
      Alert.alert('Thông báo !', 'Chưa chọn ảnh nhóm');
    } else {
      const member_id = member.map(i => i.id);
      try {
        setIsLoading(true);
        member_id.push(userId);
        const reference = storage().ref(`Conversations/Group/files/${idImage}`);
        const avatar = await uploadImage(reference, image);
        docRef
          .add({
            type: 'Group',
            name: input,
            image: avatar,
            last_message: timestamp,
            message: {},
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
  return (
    <View
      style={{
        backgroundColor: '#fff',
        padding: 22,
        marginHorizontal: 22,
        alignItems: 'center',
      }}>
      <TouchableOpacity onPress={ChangeAvatar} style={styles.avatarContainer}>
        {image.length != 0 ? (
          <Avatar.Image source={{uri: image}} size={66} />
        ) : (
          <Icon name="person-circle-outline" size={66} color={COLORS.black} />
        )}
        <Text style={styles.changeAvatarText}>Ảnh nhóm</Text>
      </TouchableOpacity>
      <Text style={{...FONTS.h4}}>Đặt tên cho đoạn chat mới</Text>
      <UITextInput
        style={{height: 44}}
        placeholder="Tên nhóm (Bắt buộc)"
        value={input}
        onChangeText={setInput}
        // onSubmit={() => handleCreate(input)}
      />
      <View style={styles.buttonContainer}>
        <Button textColor="#2C6BED" onPress={onHide}>
          Hủy
        </Button>
        <Button textColor="#2C6BED" onPress={() => handleCreate(input)}>
          Tạo
        </Button>
      </View>
      <Loading isVisible={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({});
