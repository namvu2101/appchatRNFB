import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Dimensions,
  Alert,
  FlatList,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import {Avatar, Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {COLORS, SIZES, images} from '../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../components/PageContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {conversationStore, profileStore} from '../store';

export default function More() {
  const navigation = useNavigation();
  const {profile, setFriends} = profileStore();
  const {setConversations} = conversationStore();
  const listItem = [
    {
      icon: 'account-outline',
      name: 'Account',
      dec: 'Privacy, security, change number',
    },
    {
      icon: 'chat-processing-outline',
      name: 'Chat',
      dec: 'Chat history,theme,wallpapers',
    },
    {
      icon: 'bell-ring-outline',
      name: 'Notifycations',
      dec: 'Messages, group and others',
    },
    {
      icon: 'help-circle-outline',
      name: 'Help',
      dec: 'Help center,contact us, privacy policy',
    },
    {
      icon: 'arrow-expand',
      name: 'Storage and data',
      dec: 'Network usage, stogare usage',
    },
    {
      icon: 'account-multiple-plus-outline',
      name: 'Invite a friend',
      dec: 'Add New Your  Friend',
    },
    {
      icon: 'account-multiple-plus',
      name: 'Invite a friend',
      dec: 'Add New Your  Friend',
    },
    {
      icon: 'account-multiple-plus',
      name: 'Invite a friend',
      dec: 'Add New Your  Friend',
    },
    {
      icon: 'account-multiple-plus',
      name: 'Invite a friend',
      dec: 'Add New Your  Friend',
    },
  ];

  const handleLogOut = () => {
    Alert.alert(
      'Thông báo!',
      'Bạn muốn đăng xuất?',
      [
        {
          text: 'Ok',
          onPress: () => {
            AsyncStorage.setItem('userId', '');
            setConversations([])
            setFriends([])
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

  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <View style={styles.container}>
          <Pressable
            onPress={() => navigation.navigate('UserProfile')}
            style={{
              height: 100,
              flexDirection: 'row',
              alignItems: 'center',
              width: 300,
            }}>
            <Avatar.Image source={{uri: profile?.image}} size={66} />
            <View style={{width: 180, marginHorizontal: 10}}>
              <Text style={{color: '#000'}}>{profile.name}</Text>
              <Text style={{color: '#000'}}>{profile.phone}</Text>
            </View>
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={20}
              color={'#000'}
            />
          </Pressable>

          <ScrollView>
            {listItem.map((i, index) => (
              <Pressable
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: 300,
                  marginBottom: 20,
                }}>
                <Avatar.Icon icon={i.icon} size={50} color={'#FFFFFF'} />
                <View style={{marginHorizontal: 10}}>
                  <Text style={{color: '#000'}}>{i.name}</Text>
                  <Text style={{color: '#000'}}>{i.dec}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
        <Button
          style={{marginVertical: 10, backgroundColor: 'white'}}
          textColor="#000"
          icon="logout"
          rippleColor={COLORS.white}
          onPressIn={handleLogOut}>
          Log Out
        </Button>
      </PageContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
    height: SIZES.height * 0.8,
  },
});
