import {StyleSheet, Text, View, TextInput, Image} from 'react-native';
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Avatar,
  Button,
  Card,
  Dialog,
  Icon,
  Input,
  ListItem,
} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, SIZES, FONTS, images} from '../../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../../components/PageContainer';
import {db} from '../../firebase/firebaseConfig';
import dispath from './dispath';
import CardDrive from '../Dialog/CardService';
import UIModals from '../../components/UIModals';
import UITextInput from '../../components/UITextInput';
import CardService from '../Dialog/CardService';
import {handlePickImage} from '../../components/ImagePicker';
import Loading from '../Dialog/Loading';

export default function ServiceChat({route}) {
  const navigation = useNavigation();
  const [input, setInput] = useState('');
  const [isVisible, setisVisible] = useState(false);
  const service = route.params;
  const [image, setImage] = useState(service.data.image);
  const [title, setTitle] = React.useState('');
  const [detail, setDetail] = React.useState('');
  const [isLoading, setIsLoading] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleSend = async messageType => {
    const messageText = messageType == 'card' ? 'đã gửi thông điệp' : input;
    const formData = {
      timeSend: new Date(),
      senderId: service.id,
      senderImage: service.data.image,
      name: service.data.name,
      messageType: messageType == 'card' ? 'card' : 'text',
      messageText: messageText,
    };
    if (messageType == 'card') {
      setDetail('');
      setTitle('');
      formData.card = {
        image,
        title,
        detail,
      };
    }
    try {
      await setIsLoading(true);
      await service.data.follower.map(i => {
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
              messageText: formData.messageText,
              name: service.data.name,
              id: service.id,
            },
          })
          .then(() => console.log('Thong bao thanh cong'))
          .catch(e => console.log('loi update', e));

        dispath(docRef, formData);
      });
      await setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }

    setInput('');
  };

  const ChangeImage = async () => {
    const avatar = await handlePickImage();
    if (avatar != 'Error') {
      setImage(avatar.uri);
    }
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
        <Card>
          <TextInput
            style={{
              height: 50,
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              paddingHorizontal: 10,
              color: 'black',
            }}
            value={title}
            onChangeText={setTitle}
            placeholder="Tiêu đề"
            placeholderTextColor={'black'}
          />
          <Card.Divider />
          <Card.Image
            onPress={ChangeImage}
            style={{padding: 0}}
            source={{
              uri: image,
            }}
          />
          <TextInput
            style={{
              height: 50,
              width: SIZES.width * 0.8,
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              paddingHorizontal: 10,
              color: 'black',
            }}
            value={detail}
            onChangeText={setDetail}
            placeholder="Nội dung"
            placeholderTextColor={'black'}
          />
          <Button
            onPress={() => setisVisible(true)}
            buttonStyle={{
              borderRadius: 0,
              marginLeft: 0,
              marginRight: 0,
              marginBottom: 0,
            }}
            title="Xem trước"
          />
        </Card>
        <View style={styles.footer}>
          <Icon
            name="image"
            type="feather"
            color={COLORS.primary}
            size={30}
            onPress={() => {
              setisVisible(true);
            }}
            iconStyle={{padding: 10, borderRadius: 50}}
          />
          <TextInput
            value={input}
            onChangeText={setInput}
            style={{
              ...FONTS.h4,
              width: '60%',
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
      <Loading isVisible={isLoading} />
      <UIModals isVisible={isVisible} onClose={() => setisVisible(false)}>
        <CardService
          image={image}
          title={title}
          detail={detail}
          onPress={() => {
            setisVisible(false);
            handleSend('card');
          }}
        />
      </UIModals>
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
