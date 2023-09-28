import React from 'react';
import {KeyboardAvoidingView} from 'react-native';
import {Platform} from 'react-native';
import {COLORS, SIZES} from '../constants';

const PageContainer = props => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : ''}
      style={{
        flex:1,
        height: SIZES.height,
        width: SIZES.width,
        backgroundColor: COLORS.white,
        alignItems:'center',
        ...props.style
      }}>
      {props.children}
    </KeyboardAvoidingView>
  );
};

export default PageContainer;
