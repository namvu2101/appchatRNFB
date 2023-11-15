import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useContext} from 'react';
import {COLORS, FONTS, SIZES, images} from '../../constants';
import {Avatar, Button, List} from 'react-native-paper';
import {authStore, profileStore} from '../../store';
import {useNavigation} from '@react-navigation/native';
import {handleActions} from '../User/actions';
import {ListItem} from '@rneui/themed';

export default function Custom_Item({item, data, setData, id, index}) {
  const navigation = useNavigation();
  const {userId} = authStore();
  const handleAccept = () => {
    handleActions('Chấp nhận', id);
    setData(data.filter(i => i.id != id));
  };

  const handleReject = () => {
    setData(data.filter(i => i.id != id));
    handleActions('Từ chối', id);
  };
 
  return (
    <ListItem
      onPress={() =>
        navigation.navigate('Information', {
          id: id,
        })
      }
      containerStyle={{
        height: 80,
        backgroundColor: COLORS.secondaryWhite,
        marginBottom: 10,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      }}>
      <View style={styles.image}>
        <Avatar.Image
          source={{uri: item?.image || images.imageLoading}}
          size={55}
        />
      </View>
      <ListItem.Content style={{width: 200}}>
        <ListItem.Title
          style={{fontWeight: 'bold', paddingVertical: 5}}
          numberOfLines={1}>
          {item.name}
        </ListItem.Title>
        <ListItem.Subtitle>
          <View
            style={{
              flexDirection: 'row',
              width: SIZES.width / 1.8,
              justifyContent: 'space-between',
            }}>
            <Button
              mode="elevated"
              textColor={COLORS.white}
              buttonColor={'blue'}
              style={{borderRadius: 10, width: '45%'}}
              onPress={() => handleAccept()}>
              Thêm
            </Button>
            <Button
              mode="outlined"
              textColor={'blue'}
              onPress={() => handleReject()}
              style={{
                borderColor: COLORS.primary,
                borderRadius: 10,
                width: '45%',
              }}>
              Xóa
            </Button>
          </View>
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  items: {
    width: SIZES.width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 33,
    borderColor: COLORS.primary,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
