import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import UITextInput from './UITextInput';
import {COLORS} from '../constants';

export default function UIModals(props) {
  return (
    <Modal
      isVisible={props.isVisible}
      onBackdropPress={props.onClose}
      animationIn={props.animationIn}
      animationOut={props.animationOut}
      animationInTiming={props.InTiming}
      animationOutTiming={props.OutTiming}
      backdropColor={COLORS.gray}>
      {props.children}
    </Modal>
  );
}

const styles = StyleSheet.create({});
