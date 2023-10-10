import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  TextInput,
  Keyboard,
  Alert,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Custom_item from './Custom_item';
import Create_Group from './CreateGroup';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import {db} from '../../firebase/firebaseConfig';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS, SIZES} from '../../constants';
import UITextInput from '../../components/UITextInput';
import {Avatar} from 'react-native-paper';
import {profileStore} from '../../store';
import {UserType} from '../../../UserContext';
import UIModals from '../../components/UIModals';
import UISearch from '../../components/UISearch';

export default function AddChat({route}) {
  const [isVisible, setisVisible] = useState(false);
  const [dataList, setDataList] = useState([]);
  const {userFriends} = useContext(UserType);
  const [input, setInput] = useState('');
  const navigation = useNavigation();
  const onClose = () => {
    setisVisible(false);
  };

  const onOpen = () => {
    if (input.length == 0) {
      Alert.alert('Message', 'Name group is empty');
    } else {
      Keyboard.dismiss();
      setisVisible(true);
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({headerTitle: 'Tin nhắn mới'});
  }, []);

  const getDada = async () => {
    // const uid = await AsyncStorage.getItem('uid');
    // db.collection('Conversations').onSnapshot(onSnapshot => {
    //   const list = [];
    //   onSnapshot.docs.forEach(i => {
    //     const group = {
    //       id: i.id,
    //       name: i.data().name,
    //       avatar: i.data().avatar,
    //       text: i.data().text,
    //       timestamp: i.data().timestamp,
    //     };
    //     if (
    //       i.data().type === 'Group' &&
    //       i.data().member_id?.find(it => it === uid)
    //     ) {
    //       list.push(group);
    //     }
    //   });
    //   setDataList(list);
    // });
  };

  useEffect(() => {
    const filter = userFriends.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
    setDataList(filter);
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <View style={{flex: 1, marginHorizontal: 22}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 22,
            }}>
            <Text style={{...FONTS.h3}}>Đến: </Text>
            <UITextInput style={{height: 30}} />
          </View>
          <View style={styles.underHeaderContainer}>
            <TouchableOpacity
              style={styles.underHeader}
              onPress={() => setisVisible(true)}>
              <Avatar.Icon
                icon="account-group"
                size={44}
                color="black"
                style={{backgroundColor: COLORS.secondaryWhite}}
              />
              <Text style={{...FONTS.h3}}>Tạo nhóm chat</Text>
            </TouchableOpacity>
            {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '90%',
              justifyContent: 'space-between',
            }}>
            <TextInput
              value={input}
              onChangeText={setInput}
              autoFocus
              style={{width: 80}}
            />
            <Pressable onPress={onOpen}>
              <MaterialCommunityIcons
                name="plus-circle-outline"
                size={30}
                color="#fff"
              />
            </Pressable>
          </View> */}
          </View>
          {/* -----------------------Body--------------------- */}
          <View style={styles.bodyContainer}>
            <Text style={{...FONTS.h4, color: COLORS.secondaryGray}}>
              Gợi ý
            </Text>
            <FlatList
              data={dataList}
              renderItem={({item, index}) => (
                <Custom_item item={item} index={index} />
              )}
            />
          </View>
        </View>
        <UIModals onClose={onClose} isVisible={isVisible}>
          <Create_Group
            isVisible={isVisible}
            onClose={onClose}
            friends={dataList}
            input={input}
          />
        </UIModals>
      </PageContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 300,
    height: 50,
    marginVertical: 10,
  },
  underHeaderContainer: {
    width: '80%',
    marginVertical: 10,
  },
  underHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  underHeaderText: {
    marginHorizontal: 20,
  },
  createGroupIcon: {
    marginHorizontal: 20,
  },
  bodyContainer: {
    marginVertical: 22,
  },
  groupChatsText: {
    textAlign: 'center',
  },
});
