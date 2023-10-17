import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SIZES, FONTS, COLORS} from '../constants';

export default function BoxSearch(props) {
  return (
    <View style={{...styles.container, ...props.style}}>
      <TouchableOpacity onPress={props.onPress}>
        <MaterialCommunityIcons name="magnify" color="black" size={24} />
      </TouchableOpacity>
      <TextInput
        editable={props.editable}
        value={props.value}
        onChangeText={props.onChangeText}
        style={{...FONTS.h3, flex: 1, paddingLeft: 7}}
        cursorColor={'black'}
        clearTextOnFocus={false}
        placeholder=" Tìm kiếm"
        placeholderTextColor={'#CACACA'}
        onSubmitEditing={props.onPress}
      />
      {props.value && props.value.length != 0 && (
        <TouchableOpacity onPress={props.onClear}>
          <Ionicons name="close-circle" color="black" size={24} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: SIZES.width * 0.88,
    backgroundColor: '#F0F0F0',
    height: 44,
    borderRadius: 23,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 12,
  },
});
