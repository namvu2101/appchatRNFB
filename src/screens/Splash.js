import React, {useLayoutEffect, useEffect, useContext} from 'react';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {Avatar, Button, ProgressBar} from 'react-native-paper';
import {authStore, conversationStore, profileStore} from '../store';
import NetInfo from '@react-native-community/netinfo';
import {db, timestamp} from '../firebase/firebaseConfig';
import {UserType} from '../contexts/UserContext';
import {COLORS, SIZES} from '../constants';
import {Alert, Text, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  withSpring,
} from 'react-native-reanimated';
import {firebase} from '@react-native-firebase/auth';
import {SafeAreaView} from 'react-native-safe-area-context';

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
          Alert.alert(
            'Thông báo',
            'Không có kết nối internet',
          );
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
            getConversations(userId),
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
        Alert.alert(
          'Thông báo',
          'Đã xảy ra lỗi lấy dữ liệu người dùng. Hãy thử lại sau ít phút',
        );
        console.error(error);
      }
    }

    checkUserAndRedirect();
  }, [isFocused, NetInfo]);
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
  const getConversations = async id => {
    db.collection('Conversations')
      .orderBy('last_message', 'desc')
      .onSnapshot(
        snapshot => {
          const res = snapshot.docs.filter(
            i => i.data()?.senderID == id || i.data()?.member_id?.includes(id),
          );
          const data = res.map(doc => ({
            id: doc.id,
            data: doc.data(),
          }));

          setUserConversations(data);
        },
        error => {
          console.error('Lỗi khi lấy dữ liệu cuộc trò chuyện: ', error);
        },
      );
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
    <SafeAreaView
      style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#208FE9',
          width: SIZES.width,
        }}>
        <Animated.View style={animatedStyle}>
          <Avatar.Image source={require('../assets/iconapp.jpg')} size={88} />
        </Animated.View>
      </View>
      <Button
        style={{
          position: 'absolute',
        }}
        textColor="white">
        VPN 2023
      </Button>
    </SafeAreaView>
  );
};

export default Splash;
