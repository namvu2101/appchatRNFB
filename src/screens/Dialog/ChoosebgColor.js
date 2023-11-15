import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React from 'react';
import {Dialog} from '@rneui/themed';
import {FONTS, SIZES} from '../../constants';
import {Icon} from 'react-native-paper';
import {BgColors} from '../../constants/colors';

export default function ChoosebgColor({setBgColor, onClose, docRef}) {
  const updateBackground = async item => {
    setBgColor(item);
    onClose();

    await docRef.update({
      bgColor: item,
    });
  };
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={{padding: 7}}
        onPress={() => {
          updateBackground(item);
        }}>
        <Icon source={'checkbox-blank-circle'} size={30} color={item} />
      </TouchableOpacity>
    );
  };
  return (
    <View style={{height: 300, backgroundColor: 'white', alignItems: 'center'}}>
      <Dialog.Title title="Chọn màu nền đoạn Chat" titleStyle={FONTS.h3} />
      <FlatList
        data={BgColors}
        renderItem={renderItem}
        numColumns={5}
        keyExtractor={item => item}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
