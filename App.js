import {StyleSheet, Text, View} from 'react-native';
import StackNavigator from './src/navigations/StackNavigator';
import {UserContext} from './src/contexts/UserContext';
import {PaperProvider} from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider>
      <UserContext>
        <StackNavigator />
      </UserContext>
    </PaperProvider>
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
