import uuid from 'react-native-uuid';
import React, {useState} from 'react';
export function getInitialItems(type) {
  const items = [
    {icon: 'pencil', color: '#000', title: 'Background', onPress: () => {}},

    {
      icon: 'emoticon-cool-outline',
      color: '#000',
      title: 'Biểu cảm',
      onPress: () => {},
    },
    {
      icon: 'magnify',
      color: '#000',
      title: 'Tìm kiếm trong đoạn chat',
      onPress: () => {},
    },
    {
      icon: 'file-image',
      color: '#000',
      title: 'Files',
      onPress: () => {},
    },
  ];

  if (type === 'Group') {
    items.push({
      icon: 'delete-forever-outline',
      color: '#000',
      title: 'Rời nhóm',
    });
    const groupItems = [
      {title: 'Đổi tên nhóm', onPress: () => {}},
      {title: 'Thành viên', onPress: () => {}},
      {title: 'Đổi ảnh nhóm', onPress: () => {}},
    ];

    return groupItems.concat(items);
  } else {
    items.unshift({title: 'Biệt danh', onPress: () => {}});
    items.push(
      {
        icon: 'eye-off',
        color: '#000',
        title: 'Ẩn đoạn chat',
      },
      {
        icon: 'delete-forever-outline',
        color: '#000',
        title: 'Xóa đoạn chat',
      },
    );
  }

  return items;
}

export function getIconItems(type, isNotify) {
  return [
    {
      icon: 'phone',
      color: '#000',
      title: 'Gọi',
    },
    {
      icon: 'video',
      color: '#000',
      title: 'Video',
    },
    {
      icon: type === 'Group' ? 'account-plus' : 'account',
      color: '#000',
      title: type === 'Group' ? 'Thêm' : 'Thồng tin',
    },
    {
      icon: isNotify ? 'bell' : 'bell-off',
      color: isNotify ? '#000' : '#3777F0',
      title: isNotify ? 'Tắt' : 'Bật',
    },
  ];
}
