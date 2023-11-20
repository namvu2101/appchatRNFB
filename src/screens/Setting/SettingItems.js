import {useNavigation} from '@react-navigation/native';
import {StyleSheet, Text, View, Alert} from 'react-native';
import React from 'react';

const styles = StyleSheet.create({});
export default function SettingItems() {
  const navigation = useNavigation();
  const listItem = [
    {
      icon: 'account-outline',
      name: 'Thông tin',
      dec: 'Tên, ảnh đại diện, địa chỉ...',
      onPress: () => {
        navigation.navigate('UserProfile');
      },
    },
    {
      icon: 'chat-processing-outline',
      name: 'Dịch vụ Chat',
      dec: 'Đăng ký nhận tin nhắn dịch vụ',
      onPress: () => {
        navigation.navigate('Service');
      },
    },
    {
      icon: 'inbox-full-outline',
      name: 'Quản lý dịch vụ Chat',
      dec: 'Quản lý và đăng ký dịch vụ Chat',
      onPress: () => {
        navigation.navigate('ManageServices');
      },
    },

    {
      icon: 'account-multiple-plus-outline',
      name: 'Mời bạn bè',
      dec: 'Chia sẻ link với bạn bè',
      onPress: () => {
        Alert.alert('Thông báo', 'Chức năng chưa hoàn tiện');
      },
    },
    {
      icon: 'link-plus',
      name: 'Liên kết với tài khoản Social',
      dec: 'Google, Facebook hoặc Apple',
      onPress: () => {
        Alert.alert('Thông báo', 'Chức năng chưa hoàn tiện');
      },
    },
    {
      icon: 'key-outline',
      name: 'Đổi mật khẩu',
      dec: 'Thay đổi mật khẩu hiện tại',
      onPress: () => {
        navigation.navigate('ChangePass');
      },
    },
    {
      icon: 'account-lock-outline',
      name: 'Khóa tài khoản tạm thời',
      dec: 'Khóa tài khoản của bạn ',
      onPress: () => {
        Alert.alert('Thông báo', 'Chức năng chưa hoàn tiện');
      },
    },
    {
      icon: 'help-circle-outline',
      name: 'Hỗ trợ',
      dec: 'Liên hệ hỗ trợ nếu có lỗi xảy ra',
      onPress: () => {
        Alert.alert('Thông báo', 'Vui lòng liên hệ Nam đẹp trai 0974046550');
      },
    },
  ];

  return listItem;
}
