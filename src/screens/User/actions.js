import AsyncStorage from '@react-native-async-storage/async-storage';
import {db} from '../../firebase/firebaseConfig';
import {firebase} from '@react-native-firebase/firestore';

export const handleActions = async (action, id) => {
  const userId = await AsyncStorage.getItem('userId');

  switch (action) {
    case 'Hủy yêu cầu':
      remove(userId, id);
      break;
    case 'Kết bạn':
      request(userId, id);
      break;

    case 'Chấp nhận':
      add(userId, id);
      break;
    case 'Từ chối':
      reject(userId, id);
      break;

    default:
      break;
  }
};

const add = (userId, id) => {
  updateFriends(userId, id);
  updateFriends(id, userId);
  updateSentRequests(id, userId);
  updateRequests(userId, id);
};
const request = (userId, id) => {
  updateRequests(id, userId, 'sent');
  updateSentRequests(userId, id, 'sent');
};
const remove = (userId, id) => {
  updateSentRequests(userId, id, 'remove');
  updateRequests(id, userId, 'remove');
};
const reject = (userId, id) => {
  updateRequests(userId, id);
  updateSentRequests(id, userId);
};
const updateFriends = (id, data) => {
  db.collection('friends')
    .doc(id)
    .set(
      {
        list_friends: firebase.firestore.FieldValue.arrayUnion(data),
      },
      {merge: true},
    );
};

const updateRequests = (id, data, action) => {
  const docRef = db.doc(`friendRequests/${id}`);

  if (action == 'sent') {
    docRef.set(
      {
        list_friendRequests: firebase.firestore.FieldValue.arrayUnion(data),
      },
      {merge: true},
    );
  } else {
    docRef.set(
      {
        list_friendRequests: firebase.firestore.FieldValue.arrayRemove(data),
      },
      {merge: true},
    );
  }
};

const updateSentRequests = (id, data, action) => {
  const docRef = db.doc(`sentRequestFriends/${id}`);
  if (action == 'sent') {
    docRef.set(
      {
        list_sentRequestFriends: firebase.firestore.FieldValue.arrayUnion(data),
      },
      {merge: true},
    );
  } else {
    docRef.set(
      {
        list_sentRequestFriends:
          firebase.firestore.FieldValue.arrayRemove(data),
      },
      {merge: true},
    );
  }
};
