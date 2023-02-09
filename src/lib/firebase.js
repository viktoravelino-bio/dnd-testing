// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { collection, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDHaK2I3wPsSvIznYNdACnpdlbNO6H9BJM',
  authDomain: 'dnd-testing-21484.firebaseapp.com',
  projectId: 'dnd-testing-21484',
  storageBucket: 'dnd-testing-21484.appspot.com',
  messagingSenderId: '209190368784',
  appId: '1:209190368784:web:aa0b98359ec65e3d07fc95',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const statusCollection = collection(db, 'status');
export const tasksCollection = collection(db, 'tasks');
