import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import UITextInput from '../../components/UITextInput';
import {Button} from 'react-native-paper';

export default function ChangeNameChat(props) {
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
    <View style={{alignItems: 'center', backgroundColor: '#fff'}}>
      <UITextInput
        autoFocus={true}
        style={{height: 55}}
        placeholder="Nhập tên (Bắt buộc)"
        value={newName}
        onChangeText={setnewName}
        onSubmit={() => handleUpdateName()}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          width: '100%',
          marginVertical: 10,
        }}>
        <Button textColor="#2C6BED" onPress={props.onClose}>
          Hủy
        </Button>
        <Button textColor="#2C6BED" onPress={handleUpdateName}>
          Cập nhật
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
