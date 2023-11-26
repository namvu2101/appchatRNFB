import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BottomSheet, Icon, ListItem} from '@rneui/themed';
import {COLORS, FONTS} from '../constants';

export default function UIBottomSheet({isVisible, setIsVisible, data, type}) {
  return (
    <BottomSheet
      modalProps={{
        animationType: 'fade',
      }}
      isVisible={isVisible}
      onBackdropPress={() => setIsVisible(false)}>
      <View
        style={{
          backgroundColor: 'white',
          padding: 10,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          marginHorizontal: 5,
        }}>
        <Icon
          name="keyboard-arrow-down"
          size={25}
          onPressIn={() => {
            setIsVisible(false);
          }}
        />
        {data.map((l, i) => (
          <ListItem
            key={i}
            containerStyle={{
              marginTop: 5,
              backgroundColor: COLORS.secondaryWhite,
              borderRadius: 15,
            }}
            onPress={l.onPress}>
            <Icon
              type="material-community"
              name={l.icon}
              size={25}
              onPressOut={() => {}}
            />
            <ListItem.Content>
              <ListItem.Title style={{...FONTS.h3}}>{l.title}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 10,
  },
});
