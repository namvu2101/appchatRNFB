import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, SIZES, images} from '../../constants';
import Video from 'react-native-video';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-paper';
import {downloadFile} from '../../components/DownFile';

export default function MediaScreen({route}) {
  const uri = route.params.uri;
  const mediaType = route.params.mediaType;
  const navigation = useNavigation();
  const icons = [
    {
      icon: 'arrow-collapse-down',
      onPress: () => {
        switch (mediaType) {
          case 'photo':
            downloadFile('.png', uri);
            break;
          case 'video':
            downloadFile('.mp4', uri);
            break;
          default:
            console.warn('Không tìm thấy phương tiện');
            break;
        }
      },
    },
    {icon: 'draw-pen', onPress: () => {}},
    {icon: 'dots-vertical', onPress: () => {}},
  ];
  return (
    <View style={{flex: 1, alignItems: 'center', backgroundColor: '#000000'}}>
      {mediaType === 'photo' ? (
        <Image
          source={{uri: uri || images.imageLoading}}
          style={{
            height: SIZES.height,
            width: SIZES.width,
          }}
          resizeMode="contain"
        />
      ) : (
        <Video
          source={{
            uri: uri,
          }}
          resizeMode="cover"
          controls
          style={{
            height: SIZES.height,
            width: SIZES.width,
          }}
        />
      )}

      <View
        style={{
          flexDirection: 'row',
          height: 55,
          width: SIZES.width,
          position: 'absolute',
          alignItems: 'center',
          paddingHorizontal: 22,
          justifyContent: 'space-between',
        }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{marginRight: 10}}>
          <MaterialCommunityIcons name="close" size={25} color={'#fff'} />
        </Pressable>
        <View
          style={{
            flexDirection: 'row',
            width: '40%',
            justifyContent: 'space-around',
          }}>
          {icons.map(i => (
            <TouchableOpacity
              key={i.icon}
              onPress={i.onPress}
              style={{marginRight: 10}}>
              <Icon source={i.icon} size={25} color={'#fff'} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
