import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import UISearch from '../../components/UISearch';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS, FONTS, SIZES} from '../../constants';
import Custom_Item from './Custom_Item';
import {profileStore} from '../../store';
import {db} from '../../firebase/firebaseConfig';

export default function Index() {
  const {friendRequests} = profileStore();
  const [filteredUsers, setFilteredUsers] = React.useState([]);
  useEffect(() => {
    const getData = async () => {
      const promises = friendRequests.map(async id => {
        const doc = await db.collection('users').doc(id).get();
        return {
          id: doc.id,
          name: doc.data().name,
          image: doc.data().image,
          phone: doc.data().phone,
        };
      });

      const users = await Promise.all(promises);
      setFilteredUsers(users);
    };

    getData();
  }, []);
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
          <Text style={{...FONTS.h2, color: COLORS.black}}>Request</Text>
          <TouchableOpacity onPress={() => console.log('Add contacts')}>
            <AntDesign name="plus" size={25} color={COLORS.secondaryBlack} />
          </TouchableOpacity>
        </View>
        <UISearch />
        <FlatList
          data={filteredUsers}
          renderItem={({item}) => (
            <Custom_Item
              item={item}
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
