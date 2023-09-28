// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBfj0q-T0TUcl-jDkzxEE9AsKg67rbALd0',
  authDomain: 'asas-f24c3.firebaseapp.com',
  projectId: 'asas-f24c3',
  storageBucket: 'asas-f24c3.appspot.com',
  messagingSenderId: '104942185944',
  appId: '1:104942185944:web:0fc009a5406323bbcb96ad',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp();
export {app, db, auth, storage, timestamp};
