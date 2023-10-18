import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, SIZES, FONTS, images} from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {UserType} from '../../contexts/UserContext';
import {Avatar, List} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {HistoryStore, authStore} from '../../store';

export default function Search({route}) {
  const {history_search, update} = HistoryStore();
  const navigation = useNavigation();
  const [selectedId, setSelectedId] = useState(0);
  const [input, setInput] = useState('');
  const [data, setdata] = useState([]);
  const [history, setHistory] = useState(history_search);
  const {users, userFriends} = useContext(UserType);
  const conversations = route.params.conversations;
  const group = conversations.filter(i => i.data.type == 'Group');
  const {userId} = authStore();
  useEffect(() => {
    if (input.length != 0) {
      switch (selectedId) {
        case 0:
          const newData = userFriends.concat(group);
          handleSearch(newData);
          break;
        case 1:
          handleSearch(userFriends);
          break;
        case 2:
          handleSearch(group);
          break;
        case 3:
          onSubmitSearch(users);
          break;
        default:
          setdata([]);
          break;
      }
    } else {
      setSelectedId(0);
    }
  }, [input, selectedId]);
  useEffect(() => {
    setHistory([...new Set(history_search)]);
  }, []);
  const onClear = () => {
    setInput('');
  };
  const handleSearch = data => {
    const res = data.filter(
      user =>
        user.data.name.toLowerCase().includes(input.toLowerCase()) ||
        user.data?.phone?.includes(input),
    );
    setdata(res);
  };
  const onSubmitSearch = data => {
    const newHistory = [input, ...history];
    setHistory(newHistory);
    update(newHistory);
    const res = data.filter(user => user.data.phone == input);
    setdata(res);
  };
  const list_select = ['Tất cả', 'Bạn bè', 'Nhóm chat', 'Mọi người'];
  const renderItem = ({item, index}) => {
    const Color = index === selectedId ? 'red' : 'white';
    const textColor = index === selectedId ? COLORS.black : COLORS.gray;
    return (
      <TouchableOpacity
        onPress={() => setSelectedId(index)}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          borderBottomWidth: 2,
          borderBottomColor: Color,
          paddingVertical: 10,
          paddingHorizontal: 10,
          height: 50,
        }}>
        <Text style={{...FONTS.h3, color: textColor}}>{item}</Text>
      </TouchableOpacity>
    );
  };
  const handleSelect = item => {
    switch (item.data.type) {
      case 'Group':
        navigation.navigate('Chats', {
          item: item.data,
          type: item?.data?.type,
          conversation_id: item.id,
        });
        break;

      default:
        navigation.navigate('Chats', {
          item: item.data,
          type: 'Person',
          conversation_id: `${userId}-${item.id}`,
          recipientId: item.id,
        });
        break;
    }
  };
  const renderList = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleSelect(item);
        }}>
        <List.Item
          title={item.data.name}
          titleStyle={{...FONTS.h3}}
          description={item?.data?.phone}
          descriptionStyle={{
            marginTop: 5,
            color: COLORS.secondaryGray,
          }}
          style={[
            {
              width: SIZES.width,
              alignItems: 'center',
              marginHorizontal: 20,
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
                  uri: item?.data?.image || images.imageLoading,
                }}
                size={50}
              />
            </View>
          )}
        />
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{marginRight: 10}}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={25}
              color={'#000E08'}
            />
          </Pressable>
          <TextInput
            autoFocus
            style={styles.input_search}
            value={input}
            onChangeText={setInput}
            placeholder=" Tìm kiếm"
            inputMode="search"
            onSubmitEditing={() => {
              setSelectedId(3);
            }}
          />
          {input.length != 0 && (
            <TouchableOpacity onPress={onClear}>
              <Ionicons name="close-circle" color="black" size={24} />
            </TouchableOpacity>
          )}
        </View>
        {input.length != 0 ? (
          <View style={{flex: 1}}>
            <View style={{height: 50, width: SIZES.width}}>
              <FlatList data={list_select} renderItem={renderItem} horizontal />
            </View>
            {!data.length && (
              <Text style={{...FONTS.h3, marginTop: 10, textAlign: 'center'}}>
                Không tìm thấy trong mục này
              </Text>
            )}
            <FlatList
              data={data}
              renderItem={renderList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <View style={{flex: 1, width: SIZES.width, paddingHorizontal: 22}}>
            <Text
              style={{...FONTS.h3, marginVertical: 10, textAlign: 'center'}}>
              Lịch sử tìm kiếm
            </Text>
            <FlatList
              data={history}
              renderItem={({item}) => (
                <TouchableOpacity>
                  <Text
                    style={{
                      ...FONTS.h3,
                      marginVertical: 10,
                      textAlign: 'left',
                    }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </PageContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    width: SIZES.width,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
    paddingHorizontal: 22,
  },
  input_search: {
    ...FONTS.h3,
    flex: 1,
  },
});
