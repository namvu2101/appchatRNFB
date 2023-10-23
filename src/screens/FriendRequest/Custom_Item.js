import {Pressable, StyleSheet, Text, View, Image} from 'react-native';
import React, {useContext} from 'react';
import {COLORS, FONTS, SIZES, images} from '../../constants';
import {Avatar, Button} from 'react-native-paper';
import {authStore, profileStore} from '../../store';
import {useNavigation} from '@react-navigation/native';
import {handleActions} from '../User/actions';

export default function Custom_Item({item, data, setData, id}) {
  const navigation = useNavigation();

  const handleAccept = () => {
    handleActions('Chấp nhận', id);
    setData(data.filter(i => i.id != id));
  };

  const handleReject = () => {
    setData(data.filter(i => i.id != id));
    handleActions('Từ chối', id);
  };

  return (
    <Pressable
      onPressOut={() =>
        navigation.navigate('Information', {
          id: id,
        })
      }
      style={{
        width: SIZES.width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginVertical: 10,
      }}>
      <Avatar.Image
        source={{uri: item?.image || images.imageLoading}}
        size={55}
      />
      <View style={{width: 100, alignItems: 'center'}}>
        <Text style={{...FONTS.h4, color: COLORS.black}} numberOfLines={1}>
          {item?.name}
        </Text>
        <Text
          style={{...FONTS.h4, color: COLORS.secondaryGray}}
          numberOfLines={1}>
          {item?.phone}
        </Text>
      </View>
      <Button mode="outlined" textColor="blue" onPress={() => handleAccept()}>
        Thêm
      </Button>
      <Button
        mode="elevated"
        textColor={COLORS.white}
        buttonColor={COLORS.red}
        onPress={() => handleReject()}>
        Xóa
      </Button>
    </Pressable>
  );
}

const styles = StyleSheet.create({});
