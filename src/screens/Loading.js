import React, {useLayoutEffect, useEffect, useContext} from 'react';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {Avatar, ProgressBar} from 'react-native-paper';
import {authStore, conversationStore, profileStore} from '../store';
import NetInfo from '@react-native-community/netinfo';
import {db} from '../firebase/firebaseConfig';
import {UserType} from '../../UserContext';

const LoadingScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  const {setUserId} = authStore();
  const {setUsers, setUserConversations} = useContext(UserType);
  const {setConversations} = conversationStore();
  const {setProfile, setFriendRequest, setFriends, setSentRequest} =
    profileStore();
  const [progress, setProgress] = React.useState(0);
  useEffect(() => {
    async function checkUserAndRedirect() {
      try {
        const isConnected = await NetInfo.fetch().then(
          state => state.isConnected,
        );

        if (!isConnected) {
          console.error('Không có kết nối internet');
          return;
        }
        const userId = await AsyncStorage.getItem('userId');
        if (!userId || !isFocused) {
          navigation.replace('Welcome');
          return;
        }

        await setUserId(userId);

        const promises = [
          getConversations(),
          setFriends(userId),
          setFriendRequest(userId),
          setSentRequest(userId),
          setConversations(userId),
          setProfile(userId),
          getUser(userId),
        ];

        await Promise.all(promises);

        let newProgress = 0.1;
        const intervalId = setInterval(() => {
          newProgress += 0.1;
          setProgress(newProgress);

          if (newProgress >= 1) {
            clearInterval(intervalId);
            navigation.replace('BottomTabs');
          }
        }, 200);
      } catch (error) {
        console.error(error);
      }
    }

    checkUserAndRedirect();
  }, [isFocused]);
  const getUser = async id => {
    db.collection('users').onSnapshot(doc => {
      const data = doc.docs.map(i => {
        return {
          id: i.id,
          data: i.data(),
        };
      });
      setUsers(data.filter(i => i.id != id));
    });
  };
  const getConversations = () => {
    db.collection('Conversations')
      .orderBy('last_message', 'desc')
      .onSnapshot(doc => {
        const res = doc.docs.map(i => {
          return {
            id: i.id,
            data: i.data(),
          };
        });

        setUserConversations(res);
      });
  };
  return (
    <LinearGradient
      colors={['#3777F0', '#FFFFFF']}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
      }}>
      <Avatar.Image source={require('../assets/iconapp.jpg')} size={88} />
      <ProgressBar
        progress={progress}
        color={'#FFFFFF'}
        style={{
          height: 10,
          width: 150,
          borderRadius: 5,
          backgroundColor: '#477FEE',
          marginVertical: 10,
        }}
      />
    </LinearGradient>
  );
};

export default LoadingScreen;
