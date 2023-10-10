import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import {COLORS, FONTS, SIZES, images} from '../../constants';
import {Avatar, Button, List} from 'react-native-paper';
import {authStore, profileStore} from '../../store';
import {useNavigation} from '@react-navigation/native';
import {handleActions} from '../User/actions';

export default function Request_Items({item, index}) {
  const [sentrequest, setSentrequest] = useState(false);
  const {sentRequestFriends} = profileStore();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({headerTitle: 'Thêm bạn'});
  }, []);
  useLayoutEffect(() => {
    if (sentRequestFriends.find(i => i == item.id)) {
      setSentrequest(true);
    } else {
      setSentrequest(false);
    }
  }, [sentRequestFriends]);

  const handleSent = () => {
    handleActions('Kết bạn', item.id);
  };
  const handleCancel = () => {
    handleActions('Hủy yêu cầu', item.id);
  };
  const handleSubmit = () => {
    if (sentrequest) {
      handleCancel();
    } else {
      handleSent();
    }
  };
  return (
    <TouchableOpacity
      key={index}
      onPress={() => {
        navigation.navigate('Information', {
          id: item.id,
        });
      }}>
      <List.Item
        title={item.name}
        titleStyle={{...FONTS.h3}}
        description={item.phone}
        descriptionStyle={{
          marginTop: 5,
          color: COLORS.secondaryGray,
        }}
        style={[
          {
            width: SIZES.width,
            alignItems: 'center',
            paddingHorizontal: 20,
            borderBottomColor: COLORS.secondaryWhite,
            borderBottomWidth: 1,
            paddingVertical: -10,
          },
          index % 2 == 0 && {
            backgroundColor: COLORS.tertiaryWhite,
          },
        ]}
        left={() => (
          <View>
            <View
              style={{
                flex: 1,
                height: 14,
                width: 14,
                borderRadius: 7,
                backgroundColor: COLORS.green,
                borderColor: COLORS.white,
                borderWidth: 2,
                position: 'absolute',
                bottom: 0,
                right: 2,
                zIndex: 1000,
              }}
            />

            <Avatar.Image
              source={{
                uri: item?.image || images.imageLoading,
              }}
              size={50}
            />
          </View>
        )}
        right={() => (
          <View
            style={{
              width: 80,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Button
              mode="outlined"
              textColor={sentrequest ? 'white' : 'blue'}
              buttonColor={sentrequest ? 'blue' : 'white'}
              onPress={() => {
                setSentrequest(!sentrequest);
                handleSubmit();
              }}>
              {sentrequest ? 'Hủy' : 'Gửi'}
            </Button>
          </View>
        )}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
