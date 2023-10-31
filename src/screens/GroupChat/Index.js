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

import Custom_item from './Custom_item';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS, SIZES} from '../../constants';
import UITextInput from '../../components/UITextInput';
import {Avatar} from 'react-native-paper';
import {UserType} from '../../contexts/UserContext';

export default function AddChat({route}) {
  const [dataList, setDataList] = useState([]);
  const {userFriends, users} = useContext(UserType);
  const [search, setSearch] = useState('');
  const [data, setdata] = useState(userFriends.concat(route.params.group));
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({headerTitle: 'Tin nhắn mới'});
  }, []);

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
  }, [search]);

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
            <UITextInput
              style={{...FONTS.h3, height: 30}}
              value={search}
              onChangeText={setSearch}
              underlineColor={COLORS.gray}
            />
          </View>
          <View style={styles.underHeaderContainer}>
            <TouchableOpacity
              style={styles.underHeader}
              onPress={() => navigation.navigate('CreateGroup')}>
              <Avatar.Icon
                icon="account-group"
                size={44}
                color="black"
                style={{backgroundColor: COLORS.secondaryWhite}}
              />
              <Text style={{...FONTS.h3, marginHorizontal: 10}}>
                Tạo nhóm chat
              </Text>
            </TouchableOpacity>
          </View>
          {/* -----------------------Body--------------------- */}
          <Text style={{...FONTS.h4, color: COLORS.secondaryGray}}>Gợi ý</Text>
          <View style={styles.bodyContainer}>
            <FlatList
              data={data}
              renderItem={({item, index}) => (
                <Custom_item item={item} index={index} />
              )}
            />
          </View>
        </View>
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
    width: SIZES.width * 0.8,
    marginVertical: 10,
  },
  underHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: SIZES.width,
  },
  underHeaderText: {
    marginHorizontal: 20,
  },
  createGroupIcon: {
    marginHorizontal: 20,
  },
  bodyContainer: {
    marginVertical: 22,
    flex: 1,
  },
  groupChatsText: {
    textAlign: 'center',
  },
});
