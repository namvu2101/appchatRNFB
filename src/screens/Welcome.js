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
          <Image
            source={images.illustration}
            resizeMode="contain"
            style={{
              width: SIZES.width * 0.7,
              height: SIZES.width * 0.7,
              marginVertical: 48,
            }}
          />

          <Text
            style={{
              ...(SIZES.width <= 360 ? {...FONTS.h2} : {...FONTS.h1}),
              textAlign: 'center',
              color: COLORS.black,
              marginHorizontal: SIZES.padding * 0.8,
            }}>
            Connect easily with your family and friends over countries
          </Text>

          <View style={{width: '100%', alignItems: 'center'}}>
            <Text
              style={{
                ...FONTS.h2,
                color: COLORS.black,
                marginVertical: 12,
              }}>
              Terms and Privacy
            </Text>

            <UIButton
              title="Start Messaging"
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
  },
});
