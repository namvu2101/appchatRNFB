import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import DatePicker from 'react-native-date-picker';
import { Button } from 'react-native-paper';

export default function DatePick({setnewDate,onClose}) {
    const [date, setDate] = React.useState(new Date());
    const updateDateofBirth = () => {
        const dateFormat = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        setnewDate(dateFormat);
        onClose();
      };
  return (
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
        date={date}
        onDateChange={setDate}
        androidVariant="nativeAndroid"
        onConfirm={date => {
          setDate(date);
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'flex-end',
        }}>
        <Button textColor="#2C6BED" onPress={onClose}>
          Hủy
        </Button>
        <Button textColor="#2C6BED" onPress={updateDateofBirth}>
          Lưu
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
