import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {Button, TextInput} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

export default function Modal_Actions({isVisible, onClose, type, id}) {
  const [input, setInput] = useState('');
  const navigation = useNavigation();

  return (
    <Modal isVisible={isVisible} onBackdropPress={() => onClose()}>
      {type === 'ChangeName' ? (
        <View
          style={{
            height: 111,
            backgroundColor: '#fff',
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}>
          <TextInput
            value={input}
            autoFocus
            onChangeText={setInput}
            mode="outlined"
            textColor="#000"
            cursorColor="#000"
            style={{backgroundColor: '#fff'}}
          />
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Button
              textColor="red"
              onPressOut={() => upDateName(id, input, navigation)}>
              Ok
            </Button>
            <Button
              textColor="red"
              onPressOut={() => {
                setInput('');
                onClose();
              }}>
              Cancel
            </Button>
          </View>
        </View>
      ) : (
        <View style={{height: 400, backgroundColor: '#fff'}}></View>
      )}
    </Modal>
  );
}
const upDateName = (id, newName, navigation) => {
  // db.collection('Chats')
  //   .doc(id)
  //   .update({
  //     name: newName,
  //   })
  //   .then(() =>
  //     Alert.alert('Message', 'Update Success', [
  //       {text: 'OK', onPress: () => navigation.replace('Tabs')},
  //     ]),
  //   )
  //   .catch(e => console.log(e));
};

const styles = StyleSheet.create({});
