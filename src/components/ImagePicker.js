import {launchImageLibrary} from 'react-native-image-picker';

export const handlePickImage = () => {
  return new Promise((resolve, reject) => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        resolve('Error');
        console.log('User cancelled image picker');
      } else if (response.error) {
        resolve('Error');
        console.log('ImagePicker Error: ', response.error);
      } else {
        const pathToFile = response.assets[0].uri;
        resolve(pathToFile); // Trả về đường dẫn của hình ảnh đã chọn
      }
    });
  });
};
