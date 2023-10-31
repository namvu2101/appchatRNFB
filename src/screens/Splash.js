import React, {useLayoutEffect, useEffect, useContext} from 'react';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {Avatar, ProgressBar} from 'react-native-paper';
import {authStore, conversationStore, profileStore} from '../store';
import NetInfo from '@react-native-community/netinfo';
import {db, timestamp} from '../firebase/firebaseConfig';
import {UserType} from '../contexts/UserContext';
import {COLORS} from '../constants';
import {Text, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  withSpring,
} from 'react-native-reanimated';

const Splash = ({navigation}) => {
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
        if (!userId) {
          setTimeout(() => {
            navigation.replace('Welcome');
          }, 1000);
          return;
        } else {
          await setUserId(userId);
          const promises = [
            startAnimation(),
            getConversations(),
            setFriends(userId),
            setFriendRequest(userId),
            setSentRequest(userId),
            setConversations(userId),
            setProfile(userId),
            getUser(userId),
            updateOnlineStatus(userId),
          ];
          await Promise.all(promises);
          setTimeout(() => {
            stopAnimation();
            navigation.replace('BottomTabs');
          }, 3000);
        }
      } catch (error) {
        console.error(error);
      }
    }

    checkUserAndRedirect();
  }, [isFocused]);
  const updateOnlineStatus = id => {
    const onlineStatusRef = db.collection('users').doc(id);
    onlineStatusRef.update({
      isOnline: true,
    });
  };
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
  const size = useSharedValue(92);
  const increasing = useSharedValue(1);
  const startAnimation = () => {
    size.value = withRepeat(
      withSpring(110, {
        damping: 500,
        stiffness: 300,
      }),
      -1,
      1,
    );
    increasing.value = -increasing.value; // Đảo chiều tăng/giảm
  };
  const stopAnimation = () => {
    size.value = 92;
    increasing.value = 1;
  };
  const animatedStyle = useAnimatedStyle(() => ({
    height: size.value,
    width: size.value,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: size.value / 2,
    alignItems: 'center',
    justifyContent: 'center',
  }));
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#208FE9',
      }}>
      <Animated.View style={animatedStyle}>
        <Avatar.Image source={require('../assets/iconapp.jpg')} size={88} />
      </Animated.View>
    </View>
  );
};

export default Splash;
