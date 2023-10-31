import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {COLORS, FONTS, SIZES, images} from '../../constants';
import {
  useIsFocused,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';
import {Avatar, List} from 'react-native-paper';
import {formatTime} from '../../components/Time_off';

export default function Custom_items({item, index, userId}) {
  const navigation = useNavigation();
  const isFocus = useIsFocused();
  const navigationState = useNavigationState(state => state);
  const [formattedTime, setFormattedTime] = React.useState(
    formatTime(item.last_active_at),
  );

  React.useEffect(() => {
    // Cập nhật thời gian sau mỗi giây
    let interval;
    if (navigationState.index == 1) {
      interval = setInterval(() => {
        const newFormattedTime = formatTime(item.last_active_at);
        setFormattedTime(newFormattedTime);
      }, 60000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isFocus]);
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Information', {
          id: userId,
        });
      }}>
      <List.Item
        title={item.name}
        titleStyle={{...FONTS.h3}}
        titleNumberOfLines={1}
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
          <View
            style={{
              borderColor: 'blue',
              height: 54,
              width: 54,
              borderWidth: 1,
              borderRadius: 27,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                flex: 1,
                height: 14,
                width: 14,
                borderRadius: 7,
                backgroundColor: item.isOnline ? COLORS.green : COLORS.gray,
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
          <Text
            style={{
              ...FONTS.h4,
              textAlignVertical: 'center',
              textAlign: 'center',
              width: '25%',
              color: item.isOnline ? 'red' : 'black',
            }}>
            {item?.isOnline ? 'Đang hoạt động' : `${formattedTime}`}
          </Text>
        )}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
