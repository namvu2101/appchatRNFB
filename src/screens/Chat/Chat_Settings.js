import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Avatar, Button, TextInput} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS, SIZES} from '../../constants';
import {getInitialItems, getGroupItems, getIconItems} from './SettingItems';
import {handlePickImage} from '../../components/ImagePicker';
import {db, storage} from '../../firebase/firebaseConfig';
import UIModals from '../../components/UIModals';
import uuid from 'react-native-uuid';
import UITextInput from '../../components/UITextInput';
import Setting_modals from './Setting_modals';

export default function ChatSettings({route}) {
  const navigation = useNavigation();
  const item = route.params.item;
  const conversation_id = route.params.id;
  const [isVisible, setIsVisible] = useState(false);
  const [type, setType] = useState('');
  const [data, setData] = useState(item);
  const listItems = getInitialItems(item.type);
  const listIcon = getIconItems(item.type, handleIconClick);
  const docRef = db.collection('Conversations').doc(conversation_id);
  useLayoutEffect(() => {
    docRef.onSnapshot(doc => {
      setData(doc.data());
    });
  }, [conversation_id]);
  const handleItemClick = action => {
    switch (action) {
      case 'Đổi tên nhóm':
        console.log('Đổi tên');
        onOpen(action);
        break;
      case 'Thành viên':
        console.log('Thành viên');
        onOpen(action);
        break;
      case 'Đổi ảnh nhóm':
        console.log(' Đổi ảnh nhóm');
        ChangeImage(docRef);
        break;
      case 'Background':
        onOpen(action);
        setType(action);
        break;
      case 'Biệt danh':
        onOpen(action);
        break;
      case 'Biểu cảm':
        onOpen(action);
        break;
      case 'Tìm kiếm trong đoạn chat':
        console.log('Tìm kiếm trong đoạn chat');
        onOpen(action);
        break;
      case 'Files':
        console.log('Files');
        onOpen(action);
        break;
      case 'Xóa đoạn chat':
        console.log('Xóa đoạn chat');
        onOpen(action);
        break;
      default:
        break;
    }
  };
  const handleIconClick = () => {};
  useLayoutEffect(() => {
    navigation.setOptions({});
  }, []);

  const onClose = () => {
    setIsVisible(false);
    Keyboard.dismiss();
  };

  const onOpen = action => {
    setType(action);
    setIsVisible(true);
  };
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.items}
        onPressOut={() => handleItemClick(item.title)}>
        <Text style={{...FONTS.h4}}>{item.title}</Text>
        {item.icon && (
          <MaterialCommunityIcons name={item.icon} size={30} color={'#000'} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <View style={{alignItems: 'center'}}>
          <Avatar.Image
            source={{
              uri: data?.image,
            }}
            size={88}
          />
          <Text
            style={{
              ...FONTS.h1,
              fontWeight: 'bold',
              marginVertical: 10,
            }}>
            {data?.name}
          </Text>
          <View style={styles.iconBox}>
            {listIcon.map(item => (
              <Pressable
                onPress={item.onPress}
                key={item.icon}>
                <Avatar.Icon
                  icon={item.icon}
                  size={40}
                  color={item.color}
                  style={{backgroundColor: COLORS.secondaryWhite}}
                />
                <Text style={{...FONTS.h4, textAlign: 'center'}}>
                  {item.title}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        <FlatList
          data={listItems}
          style={{
            flex: 1,
            marginVertical: 15,
            width: SIZES.width,
            paddingHorizontal: 22,
          }}
          renderItem={renderItem}
        />
        <UIModals isVisible={isVisible} onClose={onClose}>
          <Setting_modals
            isVisible={isVisible}
            onClose={onClose}
            type={type}
            data={data}
            docRef={docRef}
            item={data}
          />
        </UIModals>
      </PageContainer>
    </SafeAreaView>
  );
}
const ChangeImage = async doc => {
  try {
    const id = uuid.v4();
    const newImage = await handlePickImage();
    const reference = storage().ref(`Conversations/${doc.id}/Files/${id}`);
    await reference.putFile(newImage);
    const downloadURL = await reference.getDownloadURL();
    await doc.update({image: downloadURL});
  } catch (error) {
    console.log(error);
  }
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000000'},

  items: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: COLORS.secondaryWhite,
    borderBottomWidth: 1,
  },
  iconBox: {
    flexDirection: 'row',
    width: SIZES.width,
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
});
