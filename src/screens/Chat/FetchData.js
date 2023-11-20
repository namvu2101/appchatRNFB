import {db} from '../../firebase/firebaseConfig';

export const getConversationMessages = (id, callback) => {
  db.collection('Conversations')
    .doc(id)
    .collection('messages')
    .orderBy('timeSend', 'desc')
    .onSnapshot(
      querySnapshot => {
        const data = [];
        querySnapshot.forEach(documentSnapshot => {
          const message = {
            id: documentSnapshot.id,
            data: documentSnapshot.data(),
          };
          data.push(message);
        });
        callback(data); 

      },
      error => {
        console.error(error)
        callback([]); 
      }
    );
};
