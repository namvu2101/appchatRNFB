import {db} from './firebaseConfig';

const getConversations = async (id, callback) => {
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

        callback(data);
      },
      error => {
        console.error('Lỗi khi lấy dữ liệu cuộc trò chuyện: ', error);
      },
    );
};

export {getConversations};
