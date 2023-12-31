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

export default function ImageModals({onClose, uri, mediaType}) {
  return (
    <View style={{flex: 1, alignItems: 'center', backgroundColor: '#000000'}}>
      {mediaType === 'image' ? (
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
          ref={ref => {
            this.player = ref;
          }}
          onBuffer={this.onBuffer}
          onError={this.videoError}
          source={{uri: uri}}
          resizeMode="contain"
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
        <Pressable onPress={onClose} style={{marginRight: 10}}>
          <MaterialCommunityIcons name="close" size={25} color={'#fff'} />
        </Pressable>
        <View
          style={{
            flexDirection: 'row',
            width: '40%',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            onPress={() => console.log('down')}
            style={{marginRight: 10}}>
            <MaterialCommunityIcons
              name="arrow-collapse-down"
              size={25}
              color={'#fff'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log('edit')}
            style={{marginRight: 10}}>
            <MaterialCommunityIcons name="draw-pen" size={25} color={'#fff'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log('more')}
            style={{marginRight: 10}}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={25}
              color={'#fff'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
