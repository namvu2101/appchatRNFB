import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import UISearch from '../../components/UISearch';
import {db} from '../../firebase/firebaseConfig';
import {authStore} from '../../store';
import Request_Items from './Request_Items';
import {profileStore} from '../../store';

export default function AddContact() {
  const [contactsRandom, setContactsRandom] = useState([]);
  const {userId} = authStore();
  const {friends,friendRequests} = profileStore();
  useEffect(() => {
    const getUsers = async () => {
      const resq = await db
        .collection('users')
        .get()
        .then(doc =>
          doc.docs.map(
            item =>
              (data = {
                id: item.id,
                name: item.data().name,
                image: item.data().image,
                phone: item.data().phone,
              }),
          ),
        );
      const filterData = resq.filter(
        item => item.id != userId && !friends.includes(item.id) && !friendRequests.includes(item.id),
      );

      setContactsRandom(filterData);
    };
    getUsers();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <UISearch />
        <FlatList
          data={contactsRandom}
          renderItem={({item, index}) => (
            <Request_Items
              item={item}
              index={index}
            />
          )}
        />
      </PageContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
