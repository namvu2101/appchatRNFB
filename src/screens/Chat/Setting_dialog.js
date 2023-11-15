import {StyleSheet, Text, View, FlatList, Pressable} from 'react-native';
import React, {useState, useLayoutEffect} from 'react';
import {COLORS, FONTS, SIZES} from '../../constants';

import {Dialog} from '@rneui/themed';
import Message_Dialog from '../Dialog/Message_Dialog';
import ChangeChatName from '../Dialog/changeChatName';
import ChoosebgColor from '../Dialog/ChoosebgColor';

export default function Setting_modals(props) {
  const [isLoading, setisLoading] = useState(false);
  return (
    <Dialog isVisible={props.isVisible} onBackdropPress={props.onClose}>
      {(() => {
        switch (props.type) {
          case 'Đổi tên nhóm':
          case 'Biệt danh':
            return (
              <ChangeChatName
                name={props.item.name}
                onClose={props.onClose}
                docRef={props.docRef}
              />
            );

          case 'Background':
            return (
              <ChoosebgColor
                setBgColor={props.setBgColor}
                onClose={props.onClose}
                docRef={props.docRef}
              />
            );
          default:
            return <Message_Dialog />;
        }
      })()}
    </Dialog>
  );
}

const styles = StyleSheet.create({});
