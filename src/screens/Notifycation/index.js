import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import UISearch from '../../components/UISearch';
import {COLORS, SIZES, FONTS, images} from '../../constants';
import {Avatar, ListItem} from '@rneui/themed';

export default function Notifycation() {
  const [data, setdata] = useState(['1', '2', '3']);
  const renderItem = () => {
    return (
      <ListItem style={styles._items} bottomDivider>
        <Avatar source={images.cat} size={55} rounded />
        <ListItem.Content>
          <ListItem.Title style={{...FONTS.h3, fontWeight: 'bold'}}>
            Ten thong bao
          </ListItem.Title>
          <ListItem.Subtitle>đã chấp nhận lời mời két bạn</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  };
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
        <FlatList
          data={data}
          renderItem={renderItem}
          contentContainerStyle={{width:SIZES.width}}
          keyExtractor={index => index.toString()}
        />
      </PageContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  _items: {
    height: 80,
    backgroundColor: COLORS.secondaryWhite,
    marginVertical: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
});
