import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import UISearch from '../../components/UISearch';
import {db} from '../../firebase/firebaseConfig';
import {authStore} from '../../store';
import Request_Items from './Request_Items';
import {profileStore} from '../../store';
import {COLORS, FONTS, SIZES} from '../../constants';
import {UserType} from '../../contexts/UserContext';
export default function AddContact() {
  const [contactsRandom, setContactsRandom] = useState([]);
  const {userId} = authStore();
  const [finded, setFinded] = useState(true);
  const {friends, friendRequests} = profileStore();
  const [search, setSearch] = useState('');
  const {users} = useContext(UserType);
  const [res, setRes] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      const filterData = users.filter(
        item => !friends.includes(item.id) && !friendRequests.includes(item.id),
      );
      const randomContacts = filterData
        .sort(() => Math.random() - 0.5) // Xáo trộn mảng ngẫu nhiên
        .slice(0, 7); // Lấy 7 phần tử đầu tiên
      setContactsRandom(randomContacts);
    };
    getUsers();
  }, []);
  useEffect(() => {
    if (search.length == 0) {
      setRes([]);
    }
    setFinded(true);
  }, [search]);
  const handleSearch = () => {
    const filter = users.filter(user => user.data.phone == search);
    setRes(filter);
    console.log(filter);
    if (filter.length != 0) {
      setFinded(true);
    } else {
      setFinded(false);
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <UISearch
          inputMode="numeric"
          value={search}
          onChangeText={setSearch}
          onClear={() => setSearch('')}
          onSubmitEditing={handleSearch}
          onPress={handleSearch}
        />
        {!finded && (
          <Text style={{...FONTS.h3, marginVertical: 10}}>
            Không tìm thấy người dùng
          </Text>
        )}
        {res.length != 0 && (
          <FlatList
            data={res}
            renderItem={({item, index}) => (
              <Request_Items item={item.data} id={item.id} index={index} />
            )}
            contentContainerStyle={{
              height: 150,
            }}
          />
        )}

        <Text
          style={{
            ...FONTS.h3,
            color: COLORS.secondaryGray,
            width: SIZES.width * 0.8,
            marginBottom: 10,
          }}>
          Gợi ý
        </Text>
        <FlatList
          data={contactsRandom}
          renderItem={({item, index}) => (
            <Request_Items item={item.data} id={item.id} index={index} />
          )}
          contentContainerStyle={{
            borderTopColor: COLORS.gray,
            borderTopWidth: 1,
          }}
        />
      </PageContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
