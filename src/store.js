import {create} from 'zustand';
import {db} from './firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { images } from './constants';
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
      .get()
      .then(doc => {
        console.log('Update User Profile');
        const user = {
          name: doc.data().name,
          image: doc.data()?.image,
          phone: doc.data()?.phone,
          add: doc.data()?.add,
          email: doc.data()?.email,
          date: doc.data()?.date,
          status: doc.data()?.status,
          service: doc.data()?.service,
          sex:doc.data()?.sex || 'Chưa chọn Giới tính',
          backgroundImage:doc.data()?.backgroundImage || images.imageBackground
        };
        set({profile: user});
      });
  },
  updateProfile: newProfile => set({profile: newProfile}),
  updateService: (newService, profile) => {
    const currentProfile = profile;
    const updatedProfile = {...currentProfile, service: newService};
    set({profile: updatedProfile});
  },

  setFriendRequest: createActions(set, 'friendRequests'),
  setFriends: createActions(set, 'friends'),
  setSentRequest: createActions(set, 'sentRequestFriends'),
}));
const HistoryStore = create(set => ({
  history_search: [],
  update: newData => set({history_search: newData}),
}));
const conversationStore = create(set => ({
  conversations: [],
  updateConversations: newData => set({conversations: newData}),
  setConversations: createActions(set, 'conversations'),
}));

export {authStore, profileStore, conversationStore, HistoryStore};
