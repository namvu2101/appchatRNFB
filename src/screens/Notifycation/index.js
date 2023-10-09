import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import UISearch from '../../components/UISearch';
import {COLORS, SIZES, FONTS} from '../../constants';

export default function Notifycation() {
  const [data, setdata] = useState([]);
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
          <Text style={{...FONTS.h2, color: COLORS.black}}>Thông báo</Text>
        </View>
        <UISearch />
        {data.length == 0 && (
          <Text style={{...FONTS.h3, color: COLORS.black}}>
            Chưa có thông báo
          </Text>
        )}
      </PageContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
