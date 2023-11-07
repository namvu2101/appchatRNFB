import {AppState, StyleSheet, Text, View} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
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
import Splash from '../screens/Splash';
import AddContact from '../screens/Contacts/AddContact';
import AddChat from '../screens/GroupChat/Index';
import ChangePass from '../screens/User/ChangePass';
import Information from '../screens/User/Information';
import Search from '../screens/Home/Search';
import CreateGroup from '../screens/GroupChat/CreateGroup';
import Createinformation from '../screens/GroupChat/Createinformation';
import ManageServices from '../screens/Service/ManageServices';
import Service from '../screens/Service/Service';
import ServiceChat from '../screens/Service/ServiceChat';
import ViewMember from '../screens/Modals/viewMember';
const StackNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{headerTitle: '', headerShadowVisible: false}}>
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{headerShown: false, animation: 'fade'}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen name="PhoneNumber" component={PhoneNumber} />
        <Stack.Screen name="CreateProfile" component={CreateProfile} />
        <Stack.Screen name="ManageServices" component={ManageServices} />
        <Stack.Screen name="Service" component={Service} />
        <Stack.Screen name="ServiceChat" component={ServiceChat} />
        <Stack.Screen name="AddMember" component={ViewMember} />
        <Stack.Screen
          name="BottomTabs"
          component={MyTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false, animation: 'fade'}}
        />
        <Stack.Screen
          name="CreateGroup"
          component={CreateGroup}
          options={{headerShown: false}}
        />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="ChatSettings" component={ChatSettings} />
        <Stack.Screen name="CreateInforGroup" component={Createinformation} />
        <Stack.Screen
          name="Chats"
          component={Index}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Information" component={Information} />
        <Stack.Screen name="AddContact" component={AddContact} />
        <Stack.Screen name="AddChat" component={AddChat} />
        <Stack.Screen name="ChangePass" component={ChangePass} />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{animation: 'fade', headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
