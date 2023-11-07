import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function dispath(docRef,formData) {
    docRef
    .collection('messages')
    .add(formData)
    .then(doc => {
      doc;
    })
    .then(() => console.log('gui thanh cong'))
    .catch(e => console.log('loi gui', e));
}

