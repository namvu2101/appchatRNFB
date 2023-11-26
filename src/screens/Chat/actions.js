import {db} from '../../firebase/firebaseConfig';
import {profileStore} from '../../store';

const docRef = db.collection('Conversations');

const updateConversation = (id, messageText, name, userId) => {

  return docRef.doc(id).update({
    last_message: new Date(),
    message: {
      messageText,
      name: name,
      id: userId,
    },
  });
};
const sendPerson = async (id, data) => {
  try {
    await docRef.doc(id).collection('messages').add(data);
  } catch (error) {
    console.error('Gửi không thành công', error);
  }
};
const sendGroup = async (formData, messageText, conversation_id, name, id) => {
  try {
    const collectionRef = db
      .collection('Conversations')
      .doc(conversation_id)
      .collection('messages');

    await db
      .collection('Conversations')
      .doc(conversation_id)
      .update({
        last_message: new Date(),
        message: {
          messageText,
          name: name,
          id: id ,
        },
      });

    await collectionRef.add(formData);
  } catch (error) {
    console.error('Gửi không thành công', error);
  }
};

export {updateConversation, sendGroup, sendPerson};
