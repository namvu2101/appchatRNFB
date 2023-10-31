import React, {createContext, useContext, useState} from 'react';

const ImagePickerContext = createContext();

export function ImagePickerProvider({children}) {
  const [isImagePickerActive, setIsImagePickerActive] = useState(false);

  return (
    <ImagePickerContext.Provider
      value={{isImagePickerActive, setIsImagePickerActive}}>
      {children}
    </ImagePickerContext.Provider>
  );
}
export function useImagePicker() {
    return useContext(ImagePickerContext);
  }
