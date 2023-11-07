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
import UISearch from '../../components/UISearch';
import Custom_items from './Custom_items';
import {UserType} from '../../contexts/UserContext';

const Contacts = ({navigation}) => {
  const [search, setSearch] = useState('');
  const {userFriends} = useContext(UserType);
  const [data, setdata] = useState(userFriends);
  useEffect(() => {
    if (search.length != 0) {
      const filter = userFriends.filter(
        item =>
          item.data.name.toLowerCase().includes(search.toLowerCase()) ||
          item.data.phone.includes(search),
      );
      setdata(filter);
    } else {
      setdata(userFriends);
    }
  }, [search, userFriends]);
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
        <UISearch
          value={search}
          onChangeText={setSearch}
          onClear={() => setSearch('')}
        />
        {userFriends.length == 0 && (
          <Text style={{...FONTS.h3, color: COLORS.black}}>Chưa có bạn bè</Text>
        )}
        <FlatList
          data={data}
          renderItem={({item, index}) => (
            <Custom_items item={item.data} index={index} userId={item.id} />
          )}
          contentContainerStyle={{
            width: SIZES.width,
            paddingHorizontal: 10,
            backgroundColor: COLORS.secondaryWhite,
            borderRadius:20
          }}
          keyExtractor={item => item.id.toString()}
        />
      </PageContainer>
    </SafeAreaView>
  );
};

export default Contacts;
