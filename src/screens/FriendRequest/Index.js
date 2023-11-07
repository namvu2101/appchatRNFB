import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useContext, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import UISearch from '../../components/UISearch';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS, FONTS, SIZES} from '../../constants';
import Custom_Item from './Custom_Item';
import {profileStore} from '../../store';
import {db} from '../../firebase/firebaseConfig';
import {UserType} from '../../contexts/UserContext';

export default function Index() {
  const {friendRequests} = profileStore();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const {users} = useContext(UserType);
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  useEffect(() => {
    if (search.length == 0) {
      const filter = users.filter(item => friendRequests.includes(item.id));
      setFilteredUsers(filter);
    } else {
      const newData = [...filteredUsers];
      const res = newData.filter(
        item =>
          item.data.name.toLowerCase().includes(search.toLowerCase()) ||
          item.data.phone.includes(search),
      );
      setFilteredUsers(res);
    }
  }, [search]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <View
          style={{
            flexDirection: 'row',

            alignItems: 'center',
            paddingHorizontal: 22,
            marginTop: 22,
            width: SIZES.width,
          }}>
          <Text style={{...FONTS.h2, color: COLORS.black}}>
            Lời mời kết bạn
          </Text>
        </View>
        <UISearch
          value={search}
          onChangeText={setSearch}
          onClear={() => setSearch('')}
        />
        {friendRequests.length == 0 && (
          <Text style={{...FONTS.h3, color: COLORS.black}}>
            Không có lời mời nào
          </Text>
        )}
        <FlatList
          data={filteredUsers}
          contentContainerStyle={{padding: 10, width: SIZES.width}}
          renderItem={({item, index}) => (
            <Custom_Item
              index={index}
              item={item.data}
              id={item.id}
              setData={setFilteredUsers}
              data={filteredUsers}
            />
          )}
        />
      </PageContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
