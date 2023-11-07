import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONTS, SIZES, images} from '../../constants';
import {
  useIsFocused,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';
import {List} from 'react-native-paper';
import {formatTime} from '../../components/Time_off';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {Icon, ListItem, Avatar} from '@rneui/themed';
import {handleActions} from '../User/actions';

export default function Custom_items({item, index, userId}) {
  const navigation = useNavigation();
  const isFocus = useIsFocused();
  const navigationState = useNavigationState(state => state);
  const [formattedTime, setFormattedTime] = React.useState(
    formatTime(item.last_active_at),
  );
  const [onShow, setOnShow] = useState(false);
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
  const offset = useSharedValue(0);
  const handleShow = () => {
    setOnShow(true);
    offset.value = withSpring(SIZES.width * 0.1, {
      damping: 100,
      stiffness: 500,
    });
  };
  const handleHide = () => {
    setOnShow(false);
    offset.value = withSpring(0, {
      duration: 100,
      stiffness: 500,
    });
  };
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateX: offset.value}],
  }));

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Information', {
          id: userId,
        });
        handleHide();
      }}
      onLongPress={handleShow}>
      <ListItem
        containerStyle={{
          height: 80,
          backgroundColor: COLORS.white,
          marginVertical:5,
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.3,
          shadowRadius: 20,
        }}>
        <View
          style={{
            borderColor: 'blue',
            height: 60,
            width: 60,
            borderWidth: 1,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              flex: 1,
              height: 14,
              width: 14,
              borderRadius: 7,
              backgroundColor: item?.isOnline ? COLORS.green : COLORS.gray,
              borderColor: COLORS.white,
              borderWidth: 2,
              position: 'absolute',
              bottom: 0,
              right: 2,
              zIndex: 1000,
            }}
          />

          <Avatar
            rounded
            source={{
              uri: item?.image || images.imageLoading,
            }}
            size={55}
          />
        </View>
        <ListItem.Content>
          <ListItem.Title style={{fontWeight: 'bold'}} numberOfLines={1}>
            {item.name}
          </ListItem.Title>
          <ListItem.Subtitle
            style={{marginTop: 5, color: COLORS.secondaryGray}}>
            {item.phone}
          </ListItem.Subtitle>
        </ListItem.Content>
        <View style={{flexDirection: 'row', height: 54}}>
          <Text
            style={{
              ...FONTS.h4,
              textAlignVertical: 'center',
              textAlign: 'center',
              width: SIZES.width / 4,
              color: item.isOnline ? 'red' : 'black',
            }}>
            {item?.isOnline ? 'Đang hoạt động' : `${formattedTime}`}
          </Text>
          <Animated.View
            style={{
              width: offset,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {onShow && (
              <Icon
                name={'delete'}
                size={30}
                onPress={() => {
                  handleHide();
                  handleActions('Bạn bè', userId);
                }}
                iconStyle={{borderRadius: 50}}
              />
            )}
          </Animated.View>
        </View>
      </ListItem>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
