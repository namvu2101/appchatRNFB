import DocumentPicker, {types} from 'react-native-document-picker';

export async function pickDocument() {
  try {
    const result = await DocumentPicker.pickSingle({
      presentationStyle: 'fullScreen',
      copyTo: 'cachesDirectory',
      allowMultiSelection: true,
      type: [types.allFiles],
      
    });

    return result;
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      return 'Error';
    } else {
      throw err;
    }
  }
}
