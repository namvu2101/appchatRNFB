import {StyleSheet, Text, View, TextInput} from 'react-native';
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Avatar, Icon, Input, ListItem} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, SIZES, FONTS} from '../../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import {db} from '../../firebase/firebaseConfig';
import dispath from './dispath';

export default function ServiceChat({route}) {
  const navigation = useNavigation();
  const [input, setInput] = useState('');
  const service = route.params;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const handleSend = async (messageType, imageUri) => {
    const messageText = messageType === 'image' ? 'đã gửi hình ảnh' : input;

    const formData = {
      timeSend: new Date(),
      senderId: service.id,
      senderImage: service.data.image,
      name: service.data.name,
      messageType: messageType === 'image' ? 'image' : 'text',
      messageText: messageText,
    };

    try {
      service.data.follower.map(i => {
        const docRef = db.collection('Conversations').doc(`${i}-${service.id}`);

        docRef
          .set({
            type: 'Service',
            isOnline: true,
            last_message: new Date(),
            recipientId: service.id,
            senderID: i,
            name: service.data.name,
            image: service.data.image,
            last_active_at: '',
            last_message: new Date(),
            message: {
              messageText: messageText,
              name: service.data.name,
              id: service.id,
            },
          })
          .then(() => console.log('Thong bao thanh cong'))
          .catch(e => console.log('loi update', e));

        dispath(docRef, formData);
      });
    } catch (error) {
      console.log(error);
    }

    setInput('');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer style={{justifyContent: 'space-between'}}>
        <ListItem
          linearGradientProps={{
            colors: [COLORS.green, COLORS.primary],
            start: {x: 1, y: 0},
            end: {x: 0.3, y: 0},
          }}
          style={{width: SIZES.width}}
          ViewComponent={LinearGradient}>
          <Icon
            color={'white'}
            name="arrow-back"
            size={25}
            onPress={() => {
              navigation.goBack();
            }}
            iconStyle={{borderRadius: 50}}
          />
          <Avatar
            rounded
            source={{uri: service.data.image}}
            size={50}
            avatarStyle={{resizeMode: 'contain'}}
          />
          <ListItem.Content>
            <ListItem.Title
              style={{color: 'white', fontWeight: 'bold'}}
              numberOfLines={1}>
              {service.data.name}
            </ListItem.Title>
            <ListItem.Subtitle style={{color: 'white'}} numberOfLines={1}>
              {service.data.organization}
            </ListItem.Subtitle>
          </ListItem.Content>
          <Icon
            name="more-vert"
            size={25}
            color={'white'}
            onPress={() => {
              navigation.goBack();
            }}
            iconStyle={{borderRadius: 50}}
          />
        </ListItem>

        <View style={styles.footer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            style={{
              ...FONTS.h4,
              width: '70%',
              paddingHorizontal: 10,
              height: 50,
              borderColor: COLORS.primary,
              borderWidth: 2,
              borderRadius: 25,
              paddingLeft: 12,
              marginHorizontal: 10,
            }}
            onSubmitEditing={() => handleSend('text')}
          />
          <Icon
            name="send"
            type="feather"
            color={COLORS.primary}
            size={30}
            onPress={() => {
              handleSend('text');
            }}
            iconStyle={{padding: 10, borderRadius: 50}}
          />
        </View>
      </PageContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 60,
    width: SIZES.width,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
