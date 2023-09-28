import {launchImageLibrary} from 'react-native-image-picker';


export const handlePickImage = async (setImage) => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const pathToFile = response.assets[0].uri;
        setImage(pathToFile);
      }
    });
  };