import {StyleSheet, View} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS, SIZES} from '../../constants';
import {Tab, Text, TabView} from '@rneui/themed';
import RegisterService from './RegisterService';
import YourService from './YourService';
import ServicePending from './ServicePending';

export default function ManageServices() {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({headerTitle: 'Dịch vụ của bạn'});
  }, []);
  const [index, setIndex] = React.useState(0);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Tab
        value={index}
        onChange={e => setIndex(e)}
        indicatorStyle={{
          height: 2,
          backgroundColor: 'red',
        }}
        containerStyle={{
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: COLORS.gray,
        }}>
        <Tab.Item
          title="Dịch vụ"
          titleStyle={{...FONTS.h4, color: COLORS.primary}}
        />
        <Tab.Item
          title="Đăng ký"
          titleStyle={{...FONTS.h4, color: COLORS.primary}}
        />
        <Tab.Item
          title="Đã gửi"
          titleStyle={{...FONTS.h4, color: COLORS.primary}}
        />
      </Tab>
      {index == 0 ? (
        <YourService />
      ) : index == 1 ? (
        <RegisterService setIndex={setIndex} />
      ) : (
        <ServicePending />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  selection: {height: 55, backgroundColor: 'red', flexDirection: 'row'},
});
