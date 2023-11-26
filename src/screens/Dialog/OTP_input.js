import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Dialog} from '@rneui/themed';
import {COLORS, FONTS, SIZES} from '../../constants';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { Button } from 'react-native-paper';

export default function OTP_input(props) {
  return (
    <View style={styles._confirmCode}>
      <Text
        style={{
          ...FONTS.h3,
        }}>
        Nhập mã code gửi về SĐT của bạn
      </Text>
      <OTPInputView
        pinCount={6}
        autoFocusOnLoad={false}
        style={{flex: 1, paddingHorizontal: 10}}
        codeInputFieldStyle={{color: 'black', borderColor: 'blue'}}
        onCodeFilled={code => {
          props.setOtp(code);
        }}
      />
      <View style={styles._btn_confirm}>
        <Button textColor={COLORS.primary} onPress={props.handleSend}>
          Gửi lại
        </Button>
        <Button textColor={COLORS.primary} onPress={props.confirmCode}>
          Xác nhận
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  _btn_confirm: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    width: '100%',
  },
  _confirmCode: {
    backgroundColor: '#fff',
    height: SIZES.height / 4,
    alignItems: 'center',
    paddingVertical: 10,
  },
});
