import uuid from 'react-native-uuid';
import React, {useState} from 'react';
export function getInitialItems(type) {
  const items = [
    {icon: 'checkbox-blank-circle', title: 'Background', onPress: () => {}},

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
  const service = [
  
    {
      icon: 'bookmark-off-outline',
      color: 'red',
      title: 'Bỏ theo dõi',
    },
    {
      icon: 'delete-forever-outline',
      color: '#000',
      title: 'Xóa đoạn chat',
    },
    {
      icon: 'magnify',
      color: '#000',
      title: 'Tìm kiếm trong đoạn chat',
    },
   
  ];
  if (type === 'Service') {
    return service;
  } else return items;
}

export function getIconItems(type, isNotify) {
  if (type === 'Service') {
    return [
      {
        icon: 'alert-octagon',
        color: '#000',
        title: 'Báo cáo',
      },
      {
        icon: 'share',
        color: '#000',
        title: 'Chia sẻ',
      },
      {
        icon: 'account',
        color: '#000',
        title: 'Thồng tin',
      },
      {
        icon: isNotify ? 'bell' : 'bell-off',
        color: !isNotify ? '#000' : '#3777F0',
        title: isNotify ? 'Tắt' : 'Bật',
      },
    ];
  } else {
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
        title: type === 'Group' ? 'Thêm' : 'Thông tin',
      },
      {
        icon: isNotify ? 'bell' : 'bell-off',
        color: isNotify ? '#000' : '#3777F0',
        title: isNotify ? 'Tắt' : 'Bật',
      },
    ];
  }
}
