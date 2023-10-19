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
import LoadingScreen from '../screens/Loading';
import AddContact from '../screens/Contacts/AddContact';
import AddChat from '../screens/GroupChat/Index';
import ChangePass from '../screens/User/ChangePass';
import Information from '../screens/User/Information';
import Search from '../screens/Home/Search';
import CreateGroup from '../screens/GroupChat/CreateGroup';
import {db} from '../firebase/firebaseConfig';
import {authStore} from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';
const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const {userId} = authStore();
  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.addEventListener('change', _handleAppStateChange);
    };
  }, []);
  const _handleAppStateChange = async nextAppstate => {
    const userId = await AsyncStorage.getItem('userId');
    if (userId) {
      if (nextAppstate === 'background') {
        updateOnlineStatus(userId, false);
      } else {
        updateOnlineStatus(userId, true);
      }
    }
  };
  const updateOnlineStatus = (id, status) => {
    const time = new Date();
    const onlineStatusRef = db.collection('users').doc(id);
    onlineStatusRef.update({
      isOnline: status,
      last_active_at: time.toString(),
    });
  };
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
        <Stack.Screen
          name="CreateGroup"
          component={CreateGroup}
          options={{headerShown: false}}
        />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="ChatSettings" component={ChatSettings} />

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
