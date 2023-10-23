import {StyleSheet, Text, View, FlatList, Pressable} from 'react-native';
import React, {useState, useLayoutEffect} from 'react';
import UITextInput from '../../components/UITextInput';
import {Avatar, Button} from 'react-native-paper';
import {db} from '../../firebase/firebaseConfig';
import {COLORS, FONTS, SIZES} from '../../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import UISearch from '../../components/UISearch';
import Loading from '../../components/Loading';
import ViewMember from '../Modals/viewMember';
import ChangeNameChat from '../Modals/ChangeNameChat';
import AddNewMember from '../Modals/addMember';
import PageContainer from '../../components/PageContainer';

export default function Setting_modals(props) {
  const [isLoading, setisLoading] = useState(false);
 
  return (
    <PageContainer style={{justifyContent:'center',backgroundColor:'grey'}}>
      {(() => {
        switch (props.type) {
          case 'Đổi tên nhóm':
          case 'Biệt danh':
            return (
              <ChangeNameChat
                name={props.item.name}
                onClose={props.onClose}
                docRef={props.docRef}
              />
            );
          case 'add_member':
            return (
              <AddNewMember
                data={props.item.member_id}
                onClose={props.onClose}
                id={props.conversation_id}
              />
            );
          case 'Thành viên':
            return (
              <ViewMember
                onClose={props.onClose}
                member_id={props.item.member_id}
                create_id={props.item.create_id}
              />
            );
          case 'Files':
            return (
              <View style={{height: 500, backgroundColor: '#fff'}}>
                <Text style={{color: COLORS.secondaryBlack}}>File chia se</Text>
              </View>
            );
          default:
            return null;
        }
      })()}
    </PageContainer>
  );
}

const styles = StyleSheet.create({});
