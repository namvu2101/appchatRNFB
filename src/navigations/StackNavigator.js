import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Welcome from '../screens/Welcome';
import Login from '../screens/Login/Login';
import PhoneNumber from '../screens/Register/PhoneNumber';
import CreateProfile from '../screens/Register/CreateProfile';
import MyTabs from './BottomTabNavigation';
import Index from '../screens/Chat/Index';
import UserProfile from '../screens/User/UserProfile';
import ChatSettings from '../screens/Chat/Chat_Settings';
import LoadingScreen from '../screens/Loading';
import AddContact from '../screens/Contacts/AddContact';
import AddChat from '../screens/GroupChat/Index';
import ChangePass from '../screens/User/ChangePass';
import Information from '../screens/User/Information';
const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={{headerTitle: '', headerShadowVisible: false}}>
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen name="PhoneNumber" component={PhoneNumber} />
        <Stack.Screen name="CreateProfile" component={CreateProfile} />
        <Stack.Screen
          name="BottomTabs"
          component={MyTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="ChatSettings" component={ChatSettings} />

        <Stack.Screen name="Chats" component={Index} />
        <Stack.Screen name="Information" component={Information} />
        <Stack.Screen name="AddContact" component={AddContact} />
        <Stack.Screen name="AddChat" component={AddChat} />
        <Stack.Screen name="ChangePass" component={ChangePass} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
