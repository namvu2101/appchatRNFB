import {StyleSheet, Text, View, FlatList, Pressable} from 'react-native';
import React, {useState, useLayoutEffect} from 'react';
import UITextInput from '../../components/UITextInput';
import {Avatar, Button} from 'react-native-paper';
import {db} from '../../firebase/firebaseConfig';
import {COLORS, FONTS, SIZES} from '../../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import UISearch from '../../components/UISearch';

export default function Setting_modals(props) {
  const [newName, setnewName] = useState(props.item.name);
  const [member, setMember] = useState([]);
  const handleUpdateName = async () => {
    if (newName.length == 0) {
      console.error('khong dc de trong');
    } else {
      await props.docRef.update({name: newName});
      props.onClose();
    }
  };
  useLayoutEffect(() => {
    if (props.type == 'Thành viên') {
      props.item.member_id.forEach(id => {
        db.collection('users')
          .doc(id)
          .get()
          .then(doc => {
            const user = {
              id: id,
              name: doc.data().name,
              image: doc.data().image,
            };
            member.push(user);
          });
      });
    }
    else if(props.type == 'Files'){
        
    }
  }, []);
  return (
    <View>
      {props.type == 'Đổi tên nhóm' ? (
        <View style={{backgroundColor: '#fff', alignItems: 'center'}}>
          <UITextInput
            autoFocus={true}
            style={{height: 55}}
            placeholder="Tên nhóm (Bắt buộc)"
            value={newName}
            onChangeText={setnewName}
            onSubmit={() => handleUpdateName()}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              width: '100%',
              marginVertical: 10,
            }}>
            <Button textColor="#2C6BED" onPress={props.onClose}>
              Hủy
            </Button>
            <Button textColor="#2C6BED" onPress={handleUpdateName}>
              Cập nhật
            </Button>
          </View>
        </View>
      ) : props.type == 'Thành viên' ? (
        <View style={{backgroundColor: COLORS.white,height:SIZES.height}}>
             <View
        style={{
          flexDirection: 'row',
          height: 50,
          alignItems: 'center',
          marginHorizontal:22
        }}>
        <Pressable onPress={props.onClose}>
          <MaterialCommunityIcons name="arrow-left" size={25} color="#000" />
        </Pressable>

        <Text style={{...FONTS.h2}}>Thành viên</Text>
        {/* <Pressable disabled={!submit} onPress={() => setIsVisible(true)}>
          <Text
            style={{
              ...FONTS.h3,
              color: submit ? COLORS.secondaryBlack : COLORS.secondaryGray,
            }}>
            Tiếp
          </Text>
        </Pressable> */}
      </View>
      <UISearch style={{marginHorizontal: 22}} />
          <FlatList
            data={member}
            renderItem={({item}) => (
              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 22,
                  height: 50,
                  marginVertical:5
                }}>
                <Avatar.Image source={{uri: item.image}} size={50} />
                <Text style={{...FONTS.h3,marginLeft:20}}>{item.name}</Text>
              </Pressable>
            )}
          />
        </View>
      ) : (
        props.type == 'Files' && (
          <View style={{height: 500, backgroundColor: '#fff'}}>
            <Text style={{color: COLORS.secondaryBlack}}>File chia se</Text>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
