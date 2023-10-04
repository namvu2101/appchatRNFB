import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import {COLORS, FONTS, SIZES} from '../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {contacts} from '../../constants/data';
import UISearch from '../../components/UISearch';
import Custom_items from './Custom_items';
import {db} from '../../firebase/firebaseConfig';
import {profileStore} from '../../store';
import {UserType} from '../../../UserContext';

const Contacts = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(contacts);
  const [data, setData] = useState([]);
  const {userFriends} = useContext(UserType);
  const handleSearch = text => {
    setSearch(text);
    const filteredData = contacts.filter(user =>
      user.userName.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredUsers(filteredData);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 22,
            marginTop: 22,
            width: SIZES.width,
          }}>
          <Text style={{...FONTS.h2, color: COLORS.black}}>Liên hệ</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddContact')}>
            <AntDesign name="plus" size={25} color={COLORS.secondaryBlack} />
          </TouchableOpacity>
        </View>
        <UISearch value={search} onChangeText={setSearch} />
        {userFriends.length == 0 && (
          <Text style={{...FONTS.h3, color: COLORS.black}}>Chưa có bạn bè</Text>
        )}
        <FlatList
          data={userFriends}
          renderItem={({item, index}) => (
            <Custom_items item={item} index={index} />
          )}
          keyExtractor={item => item.id.toString()}
        />
      </PageContainer>
    </SafeAreaView>
  );
};

export default Contacts;
