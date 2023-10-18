import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import PageContainer from '../components/PageContainer';
import {SafeAreaView} from 'react-native-safe-area-context';
import {images, COLORS, SIZES, FONTS} from '../constants';
import UIButton from '../components/UIButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Welcome({navigation}) {
  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <View style={styles.container}>
          <View>
            <Image
              source={images.illustration}
              resizeMode="contain"
              style={{
                width: SIZES.width * 0.7,
                height: SIZES.width * 0.7,
                marginVertical: 44,
              }}
            />
            <Text
              style={{
                ...(SIZES.width <= 360 ? {...FONTS.h2} : {...FONTS.h1}),
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Hãy khám phá và bắt đầu cuộc trò chuyện vui vẻ ngay bây giờ!
            </Text>
          </View>

          <View style={{width: '100%', alignItems: 'center'}}>
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.black,
                marginBottom: 33,
              }}>
              Chúc bạn có cuộc trò chuyện thú vị !
            </Text>

            <UIButton
              title="Bắt đầu khám phá"
              onPress={() => navigation.navigate('Login')}
              style={{
                width: SIZES.width - 44,
                paddingVertical: 12,
                marginBottom: 48,
              }}
            />
          </View>
        </View>
      </PageContainer>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    paddingVertical: 22,
  },
});
