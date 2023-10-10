import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {COLORS, FONTS, SIZES, images} from '../../constants';
import {useNavigation} from '@react-navigation/native';
import {Avatar, List} from 'react-native-paper';

export default function Custom_items({item, index}) {
  const navigation = useNavigation();
  const formatTime = time => {
    const jsDate = time.toDate();
    const options = {hour: 'numeric', minute: 'numeric'};
    return new Date(jsDate).toLocaleString('en-US', options);
  };
  return (
    <TouchableOpacity
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
        right={() => <Text style={{...FONTS.h3}}>Online</Text>}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
