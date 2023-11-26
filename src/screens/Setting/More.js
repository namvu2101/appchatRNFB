import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useContext} from 'react';
import {Avatar, Button, Icon} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {COLORS, SIZES, FONTS} from '../../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authStore, conversationStore, profileStore} from '../../store';
import SettingItems from './SettingItems';
import {UserType} from '../../contexts/UserContext';
import {db, timestamp} from '../../firebase/firebaseConfig';
import {ListItem} from '@rneui/themed';

export default function More() {
  const navigation = useNavigation();
  const {setUserFriends} = useContext(UserType);
  const {profile} = profileStore();
  const {setConversations} = conversationStore();
  const listItem = SettingItems();
  const {userId} = authStore();
  const handleLogOut = () => {
    Alert.alert(
      'Thông báo!',
      'Bạn muốn đăng xuất?',
      [
        {
          text: 'Đồng ý',
          onPress: () => {
            updateOnlineStatus(userId);
            AsyncStorage.setItem('userId', '');
            setConversations([]);
            setUserFriends([]);
            navigation.replace('Login');
          },
        },
        {
          text: 'Hủy',
        },
      ],
      {cancelable: true},
    );
  };
  const updateOnlineStatus = id => {
    const onlineStatusRef = db.collection('users').doc(id);
    onlineStatusRef.update({
      isOnline: false,
      last_active_at: timestamp,
    });
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <View style={styles.container}>
          <ListItem
            containerStyle={{
              backgroundColor: COLORS.secondaryWhite,
              width: SIZES.width * 0.9,
              borderRadius: 15,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 10,
              },
              shadowOpacity: 0.5,
              shadowRadius: 5,
              elevation: 10,
              marginVertical: 10,
            }}
            onPress={() => navigation.navigate('UserProfile')}>
            <Avatar.Image source={{uri: profile?.image}} size={66} />
            <ListItem.Content>
              <ListItem.Title style={{...FONTS.h3, fontWeight: 'bold'}}>
                {profile?.name}
              </ListItem.Title>
              <ListItem.Subtitle style={FONTS.h4}>
                {profile?.phone}
              </ListItem.Subtitle>
            </ListItem.Content>
            <Icon source="qrcode-scan" size={20} color={'#000'} />
          </ListItem>

          <ScrollView>
            {listItem.map((i, index) => (
              <ListItem
                bottomDivider
                key={index}
                style={{width: SIZES.width * 0.9}}
                onPress={i.onPress}>
                <Avatar.Icon icon={i.icon} size={50} color={'#FFFFFF'} />
                <ListItem.Content>
                  <ListItem.Title style={{...FONTS.h3}}>
                    {i.name}
                  </ListItem.Title>
                  <ListItem.Subtitle
                    numberOfLines={1}
                    style={{...FONTS.h4, color: COLORS.secondaryGray}}>
                    {i.dec}
                  </ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            ))}
          </ScrollView>
        </View>
        <Button
          style={{marginVertical: 10, backgroundColor: 'white'}}
          textColor="#000"
          icon="logout"
          rippleColor={COLORS.white}
          labelStyle={{...FONTS.h2}}
          onPressIn={handleLogOut}>
          Đăng xuất
        </Button>
      </PageContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: SIZES.height / 1.2,
  },
});
