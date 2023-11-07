import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Animated } from 'react-native';
import { Avatar, ListItem } from '@rneui/themed';

export default function Flatlistanimation() {
  const list = new Array(30).fill(0).map((_, index) => ({ id: index }));
  const scrollY = new Animated.Value(0);
  const Avatar_SIZE = 70;
  const Item_SIZE = Avatar_SIZE + 10 * 3;

  return (
    <View style={styles.container}>
      <FlatList
        data={list}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          padding: 10,
        }}
        renderItem={({ item, index }) => {
          const inputRange = [
            -1,
            0,
            Item_SIZE * index,
            Item_SIZE * (index + 2),
          ];
          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0],
          });
          return (
            <Animated.View style={{ transform: [{ scale }] }}>
              <ListItem
                bottomDivider
                containerStyle={{
                  height: 80,
                  backgroundColor: '#cACACa',
                  marginTop: 22,
                  borderRadius: 20,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 10,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 20,
                }}>
                <Avatar
                  rounded
                  source={{
                    uri: 'https://randomuser.me/api/portraits/men/36.jpg',
                  }}
                  size={Avatar_SIZE}
                />
                <ListItem.Content>
                  <ListItem.Title style={{ fontWeight: 'bold' }}>
                    John Doe
                  </ListItem.Title>
                  <ListItem.Subtitle>President</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            </Animated.View>
          );
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
