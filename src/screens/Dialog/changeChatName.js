import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Dialog} from '@rneui/themed';
import UITextInput from '../../components/UITextInput';
import {FONTS, SIZES} from '../../constants';
import Loading from './Loading';
import {authStore, profileStore} from '../../store';

export default function ChangeChatName(props) {
  const [newName, setnewName] = React.useState(props.name);
  const [isLoading, setisLoading] = React.useState(false);
  const {userId} = authStore();
  const {profile} = profileStore();
  const handleUpdateName = async () => {
    if (newName.length == 0) {
      console.error('Không được để trống');
    } else if (newName.length > 40) {
      console.error('Tên quá dài');
    } else {
      props.onClose();
      setisLoading(true);
      await props.docRef.update({
        name: newName,
        last_message: new Date(),
        message: {
          messageText: `đã cập nhật tên đoạn chat`,
          name: profile.name,
          id: userId,
        },
      });
      setisLoading(false);
    }
  };
  return (
    <View>
      <Dialog.Title title="Tên nhóm mới" titleStyle={FONTS.h2} />
      <UITextInput
        autoFocus={true}
        style={{height: 55, width: '100%', padding: 0, ...FONTS.h3}}
        placeholder="Nhập tên (Bắt buộc)"
        value={newName}
        onChangeText={setnewName}
        onSubmit={() => handleUpdateName()}
      />
      <Dialog.Actions>
        <Dialog.Button
          title="Hủy"
          titleStyle={{color: '#2C6BED'}}
          onPress={props.onClose}
        />
        <Dialog.Button
          title="Cập nhật"
          titleStyle={{color: '#2C6BED'}}
          onPress={handleUpdateName}
        />
        <Loading isVisible={isLoading} />
      </Dialog.Actions>
    </View>
  );
}

const styles = StyleSheet.create({});
