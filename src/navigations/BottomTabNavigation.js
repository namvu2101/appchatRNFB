import {View, Text, AppState} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Messages from '../screens/Home/Messages';
import Contacts from '../screens/Contacts/Contacts';
import More from '../screens/Setting/More';
import Index from '../screens/FriendRequest/Index';
import Notifycation from '../screens/Notifycation';
import {profileStore} from '../store';
import { COLORS } from '../constants';
const Tab = createBottomTabNavigator();

const MyTabs = () => {
  const {friendRequests} = profileStore();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor:'blue',
        tabBarInactiveTintColor:'grey',
        tabBarStyle:{backgroundColor:COLORS.secondaryWhite}
      }}>
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon
              name="chatbubble-ellipses-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Contacts"
        component={Contacts}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="account-box-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="FriendsRequest"
        component={Index}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="account-arrow-left-outline"
              color={color}
              size={size}
            />
          ),

          tabBarBadge: friendRequests.length > 0 ? friendRequests.length : null,
        }}
      />
      {/* <Tab.Screen
        name="Notifycation"
        component={Notifycation}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="bell-outline"
              color={color}
              size={size}
            />
          ),
        }}
      /> */}
      <Tab.Screen
        name="More"
        component={More}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="cog-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MyTabs;
