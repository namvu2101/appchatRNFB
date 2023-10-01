import React, {useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Avatar, TextInput} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS, SIZES} from '../../constants';
import {getInitialItems, getGroupItems, getIconItems} from './SettingItems';

export default function ChatSettings({route}) {
  const navigation = useNavigation();
  const item = route.params;
  const [isVisible, setIsVisible] = useState(false);
  const [type, setType] = useState('');

  const listItems = getInitialItems(item.type);
  const listIcon = getIconItems(item.type, handleIconClick);

  const handleItemClick = action => {};
  const handleIconClick = () => {};
  useLayoutEffect(() => {
    navigation.setOptions({});
  }, []);

  const onClose = () => {
    setIsVisible(false);
  };

  const onOpen = actions => {
    setType(actions);
    setIsVisible(true);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <View style={{alignItems: 'center'}}>
          <Avatar.Image
            source={{
              uri: item?.image,
            }}
            size={88}
          />
          <Text
            style={{
              ...FONTS.h1,
              fontWeight: 'bold',
              marginVertical: 10,
            }}>
            {item.name}
          </Text>
          <View style={styles.iconBox}>
            {listIcon.map(item => (
              <Pressable onPress={item.onPress} key={item.icon}>
                <Avatar.Icon
                  icon={item.icon}
                  size={40}
                  color={item.color}
                  style={{backgroundColor: COLORS.secondaryWhite}}
                />
                <Text style={{...FONTS.h4, textAlign: 'center'}}>
                  {item.title}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <ScrollView style={styles.body}>
          <Text style={{color: '#C0C0C0'}}>Customs</Text>
          {listItems.map(item => (
            <TouchableOpacity
              key={item.title}
              style={styles.items}
              onPressOut={item.onPress}>
              <Text style={{...FONTS.h4}}>{item.title}</Text>
              {item.icon && (
                <MaterialCommunityIcons
                  name={item.icon}
                  size={30}
                  color={'#000'}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </PageContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000000'},
  body: {
    width: SIZES.width,
    marginTop: 20,
    flex: 1,
    paddingHorizontal: 22,
  },
  items: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: COLORS.secondaryWhite,
    borderBottomWidth: 1,
  },
  iconBox: {
    flexDirection: 'row',
    width: SIZES.width,
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
});
