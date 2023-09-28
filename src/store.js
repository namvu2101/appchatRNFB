import {create} from 'zustand';
import {db} from './firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
const authStore = create(set => ({
  userId: null,
  setUserId: userID => {
    set({userId: userID});
  },
}));
const createActions = (set, key) => async () => {
  const userId = await AsyncStorage.getItem('userId');
  db.collection(key)
    .doc(userId)
    .onSnapshot(querySnapshot => {
      console.log(`Update ${key}`);
      set({[key]: querySnapshot.data()?.[`list_${key}`] || []});
    });
};
const profileStore = create(set => ({
  profile: null,
  friendRequests: [],
  friends: [],
  sentRequestFriends: [],
  setProfile: id => {
    db.collection('users')
      .doc(id)
      .onSnapshot(doc => {
        console.log('Update User Profile');
        const user = {
          name: doc.data().name,
          image: doc.data().image,
          phone: doc.data().phone,
          add: doc.data().add,
          email: doc.data().email,
          date: doc.data().date,
          status: doc.data().status,
        };
        set({profile: user});
      });
  },
  setFriendRequest: createActions(set, 'friendRequests'),
  setFriends: createActions(set, 'friends'),
  setSentRequest: createActions(set, 'sentRequestFriends'),
}));

const conversationStore = create(set => ({
  conversations: [],
  setConversations: createActions(set, 'conversations'),
}));

export {authStore, profileStore, conversationStore};
