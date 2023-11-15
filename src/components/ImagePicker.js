import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export const handlePickImage = type => {
  return new Promise((resolve, reject) => {
    const options = {
      mediaType: type === 'message' ? 'mixed' : 'photo',
      includeBase64: false,
      quality: 1,
      // selectionLimit: 1,
    };

    launchImageLibrary(options, response => {
      let pathToFile;
      if (response.didCancel) {
        resolve('Error');
        console.log('User cancelled image picker');
      } else if (response.error) {
        resolve('Error');
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets[0].fileSize > 20000000) {
        console.error('File phải nhỏ hơn 20Mb');
      } else {
        if (type == 'chat') {
          pathToFile = response.assets.map(i => i.uri);
        } else {
          pathToFile = response.assets[0];
        }

        resolve(pathToFile);
      }
    });
  });
};
