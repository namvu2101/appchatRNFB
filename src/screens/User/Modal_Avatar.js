import {View, Text, Pressable} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {Button} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import ListAvatar from '../../components/ListAvatar';
import {handlePickImage} from '../../components/ImagePicker';

export default function Modal_Profile({
  isVisible,
  onClose,
  setImage,
  type,
  setDate,
}) {
  const [newdate, setNewDate] = useState(new Date());

  const updateDateofBirth = () => {
    setDate(
      newdate.getDate() +
        '/' +
        (newdate.getMonth() + 1) +
        '/' +
        newdate.getFullYear(),
    );
    onClose();
  };

  return (
    <Modal
      animationOutTiming={500}
      isVisible={isVisible}
      onBackButtonPress={() => onClose()}
      onBackdropPress={() => onClose()}
      style={{margin: 0}}>
      {type === 'Date_of_birth' ? (
        <View
          style={{
            backgroundColor: '#fff',
            alignItems: 'center',
            paddingVertical: 20,
          }}>
          <DatePicker
            textColor="black"
            mode="date"
            locale="vn"
            date={newdate}
            onDateChange={setNewDate}
            androidVariant="nativeAndroid"
            onConfirm={date => {
              setNewDate(date);
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'flex-end',
            }}>
            <Button textColor="#2C6BED" onPress={onClose}>
              Cancel
            </Button>
            <Button textColor="#2C6BED" onPress={updateDateofBirth}>
              Ok
            </Button>
          </View>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: '#fff',
            alignItems: 'center',
            paddingVertical: 20,
          }}>
          <Button
            mode="contained"
            onPress={() => {
              onClose();
              handlePickImage(setImage);
            }}>
            Select From Galery
          </Button>
          <ListAvatar setImage={setImage} onClose={onClose} />
        </View>
      )}
    </Modal>
  );
}
