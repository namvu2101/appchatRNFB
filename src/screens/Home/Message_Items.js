import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useEffect} from 'react';
import {FONTS, COLORS, images, SIZES} from '../../constants';
import {Avatar, List} from 'react-native-paper';
import {db} from '../../firebase/firebaseConfig';
import {authStore} from '../../store';

export default function Message_Items({item, index, onPress, conversation_id}) {
  const [chatmessages, setChatMessages] = React.useState([]);
  const [messageText, setMessageText] = React.useState();
  const {userId} = authStore();
  React.useLayoutEffect(() => {
    const unsubscribe = db
      .collection('Conversations')
      .doc(conversation_id)
      .collection('messages')
      .orderBy('timeSend', 'desc')
      .onSnapshot(async querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        setChatMessages(data);
      });
    return () => unsubscribe();
  }, [conversation_id]);
  React.useLayoutEffect(() => {
    if (chatmessages.length != 0) {
      if (userId == chatmessages?.[0]?.senderId) {
        setMessageText(`Bạn : ${chatmessages?.[0]?.messageText}`);
      } else {
        setMessageText(
          `${chatmessages?.[0].name} : ${chatmessages?.[0]?.messageText}`,
        );
      }
    } else {
      setMessageText(`Hãy gửi lời chào đến ${item.name}`);
    }
  }, [chatmessages]);
  return (
    <TouchableOpacity onPress={onPress}>
      <List.Item
        title={item.name}
        titleStyle={{...FONTS.h3}}
        description={messageText}
        descriptionStyle={{
          marginTop: 5,
          color: COLORS.secondaryGray,
        }}
        style={[
          {
            width: SIZES.width,
            alignItems: 'center',
            marginHorizontal: 20,
            borderBottomColor: COLORS.secondaryWhite,
            borderBottomWidth: 1,
            paddingVertical: -10,
          },
          index % 2 == 0 && {
            backgroundColor: COLORS.tertiaryWhite,
          },
        ]}
        left={() => (
          <View>
            <View
              style={{
                flex: 1,
                height: 14,
                width: 14,
                borderRadius: 7,
                backgroundColor: COLORS.green,
                borderColor: COLORS.white,
                borderWidth: 2,
                position: 'absolute',
                bottom: 0,
                right: 2,
                zIndex: 1000,
              }}
            />

            <Avatar.Image
              source={{
                uri: item?.image || images.imageLoading,
              }}
              size={50}
            />
          </View>
        )}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
