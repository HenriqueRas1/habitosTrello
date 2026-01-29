import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBtMy3m3OQJT4_av1plcQy1HbTnFjzZvLg",
  authDomain: "habitostrello.firebaseapp.com",
  projectId: "habitostrello",
  storageBucket: "habitostrello.firebasestorage.app",
  messagingSenderId: "75661681616",
  appId: "1:75661681616:web:d1e2e02b02b25405044fd5",
  measurementId: "G-QFMLF8MD5P"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
