import {StyleSheet, Text, View, Platform} from 'react-native';
import StackNavigator from './src/navigations/StackNavigator';
import {UserContext} from './src/contexts/UserContext';
import {PaperProvider} from 'react-native-paper';
import {Button, lightColors, createTheme, ThemeProvider} from '@rneui/themed';

export default function App() {
  const theme = createTheme({
    lightColors: {
      ...Platform.select({
        default: lightColors.platform.android,
        ios: lightColors.platform.ios,
      }),
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <PaperProvider>
        <UserContext>
          <StackNavigator />
        </UserContext>
      </PaperProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
