import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBLCJEWmOK7zqDah-h-ik3qPKQDsJgdNIk",
  authDomain: "bug-fix-learning-system.firebaseapp.com",
  databaseURL: "https://bug-fix-learning-system.firebaseio.com",
  projectId: "bug-fix-learning-system",
  storageBucket: "bug-fix-learning-system.appspot.com",
  messagingSenderId: "278266860",
  appId: "1:278266860:web:ba6b762579438d5454b6c9",
  measurementId: "G-XSPMT9L1HL"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firestore = firebaseApp.firestore();
