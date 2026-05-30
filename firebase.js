import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAvkj2bgxwltb5RnCxE3uHo4M3LkiXh1Eo",
  authDomain: "ayushman-8377d.firebaseapp.com",
  projectId: "ayushman-8377d",
  storageBucket: "ayushman-8377d.firebasestorage.app",
  messagingSenderId: "550822677074",
  appId: "1:550822677074:web:3ac7911187378f7e44ed8b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);