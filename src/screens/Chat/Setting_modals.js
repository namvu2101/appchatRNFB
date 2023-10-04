import {StyleSheet, Text, View, FlatList, Pressable} from 'react-native';
import React, {useState, useLayoutEffect} from 'react';
import UITextInput from '../../components/UITextInput';
import {Avatar, Button} from 'react-native-paper';
import {db} from '../../firebase/firebaseConfig';
import {COLORS, FONTS, SIZES} from '../../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import UISearch from '../../components/UISearch';
import Loading from '../../components/Loading';
import ViewMember from './viewMember';

export default function Setting_modals(props) {
  const [newName, setnewName] = useState(props.item.name);
  const [isLoading, setisLoading] = useState(false);
  const handleUpdateName = async () => {
    if (newName.length == 0) {
      console.error('khong dc de trong');
    } else {
      await props.docRef.update({name: newName});
      props.onClose();
    }
  };
  return (
    <View>
      {props.type == 'Đổi tên nhóm' || props.type == 'Biệt danh' ? (
        <View style={{backgroundColor: '#fff', alignItems: 'center'}}>
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
      ) : props.type == 'Thành viên' ? (
        <ViewMember
          onClose={props.onClose}
          member_id={props.item.member_id}
          create_id={props.item.create_id}
        />
      ) : (
        props.type == 'Files' && (
          <View style={{height: 500, backgroundColor: '#fff'}}>
            <Text style={{color: COLORS.secondaryBlack}}>File chia se</Text>
          </View>
        )
      )}
      <Loading isVisible={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({});
