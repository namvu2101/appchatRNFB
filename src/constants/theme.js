import {Dimensions} from 'react-native';
const {height, width} = Dimensions.get('window');

export const COLORS = {
  primary: '#477FEE',
  secondary: '#0F1828',
  white: '#FFFFFF',
  secondaryWhite: '#F7F7FC',
  tertiaryWhite: '#fafafa',
  green: '#2CC069',
  black: '#000000',
  secondaryBlack: '#330033',
  gray: '#CCCCCC',
  secondaryGray: '#666666',
  red:'red'
};

export const SIZES = {
  // global SIZES
  base: 8,
  font: 14,
  radius: 30,
  padding: 8,
  padding2: 10,
  padding3: 12,

  // font sizes
  largeTitle: 50,
  h1: 30,
  h2: 22,
  h3: 18,
  h4: 16,

  // app dimensions
  width,
  height,
};

export const FONTS = {
  largeTitle: {
    fontFamily: 'black',
    fontSize: SIZES.largeTitle,
    lineHeight: 55,
  },
  h1: {fontFamily: 'regular', fontSize: SIZES.h1, lineHeight: 36,color:'#000000'},
  h2: {fontFamily: 'regular', fontSize: SIZES.h2, lineHeight: 30,color:'#000000'},
  h3: {fontFamily: 'regular', fontSize: SIZES.h3, lineHeight: 22,color:'#000000'},
  h4: {fontFamily: 'regular', fontSize: SIZES.h4, lineHeight: 20,color:'#000000'},
};

const appTheme = {COLORS, SIZES, FONTS};

export default appTheme;
