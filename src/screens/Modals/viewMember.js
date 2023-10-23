import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState, useLayoutEffect} from 'react';
import {Avatar, Button} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, FONTS, SIZES} from '../../constants';
import {auth, db} from '../../firebase/firebaseConfig';
import {authStore} from '../../store';

export default function ViewMember({onClose, member_id, create_id}) {
  const [isSelect, setisSelect] = useState('1');
  const [member, setMember] = useState([]);
  const {userId} = authStore();
  useLayoutEffect(() => {
    const list = [];
    db.collection('users')
      .get()
      .then(doc => {
        doc.docs.map(i => {
          const user = {
            id: i.id,
            name: i.data().name,
            image:i.data().image,
          };
          list.push(user)
        });
        const filteredList = list.filter(item => member_id.includes(item.id));
         setMember(filteredList)
      });
     
  }, []);

  return (
    <View style={{backgroundColor: COLORS.white, height: SIZES.height}}>
      <View
        style={{
          flexDirection: 'row',
          height: 50,
          alignItems: 'center',
          marginHorizontal: 22,
        }}>
        <Pressable onPress={onClose}>
          <MaterialCommunityIcons name="arrow-left" size={25} color="#000" />
        </Pressable>

        <Text style={{...FONTS.h2}}>Thành viên</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 22,
          justifyContent: 'space-between',
        }}>
        <Button
          mode="outlined"
          onPress={() => setisSelect('1')}
          buttonColor={isSelect == 1 && COLORS.green}
          textColor="black"
          style={{flex: 1}}>
          Thành viên
        </Button>
        <Button
          mode="outlined"
          onPress={() => setisSelect('2')}
          buttonColor={isSelect == 2 && COLORS.green}
          style={{flex: 1}}
          textColor="black">
          quản trị viên
        </Button>
      </View>
      <Text style={{...FONTS.h3}}>
        Số lượng thành viên : {member_id.length}
      </Text>
      <FlatList
        data={member}
        renderItem={({item}) => (
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 22,
              height: 50,
              marginVertical: 5,
            }}>
            <Avatar.Image source={{uri: item.image}} size={50} />
            <Text style={{...FONTS.h3, marginLeft: 20}}>{item.name}</Text>
            {userId == create_id && (
              <View
                style={{
                  position: 'absolute',
                  alignItems: 'flex-end',
                  width: '100%',
                }}>
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={25}
                  color="#000"
                />
              </View>
            )}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
