import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Dialog} from '@rneui/themed';
import UITextInput from '../../components/UITextInput';
import {FONTS, SIZES} from '../../constants';

export default function ChangeChatName(props) {
  const [newName, setnewName] = React.useState(props.name);

  const handleUpdateName = async () => {
    if (newName.length == 0) {
      console.error('khong dc de trong');
    } else {
      await props.docRef.update({name: newName});
      props.onClose();
    }
  };
  return (
    <Dialog
      isVisible={props.isVisible}
      onBackdropPress={props.onClose}
      overlayStyle={{width: SIZES.width}}>
      <Dialog.Title title="Tên nhóm mới" titleStyle={FONTS.h2} />
      <UITextInput
        autoFocus={true}
        style={{height: 55}}
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
      </Dialog.Actions>
    </Dialog>
  );
}

const styles = StyleSheet.create({});
