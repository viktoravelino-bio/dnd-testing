// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { collection as fbCollection, getFirestore } from 'firebase/firestore';

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

export const COLLECTIONS = {
  status: 'status',
  tasks: 'tasks',
};

export const converters = {
  status: {
    toFirestore: (status) => {
      return {
        label: status.label,
        index: status.index,
      };
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return {
        id: snapshot.id,
        label: data.label,
        index: data.index,
      };
    },
  },
  task: {
    toFirestore: (task) => {
      return {
        label: task.label,
        index: task.index,
        statusId: task.statusId,
      };
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return {
        id: snapshot.id,
        label: data.label,
        index: data.index,
        statusId: data.statusId,
      };
    },
  },
};

export function collection(collectionName) {
  return fbCollection(db, collectionName).withConverter(
    converters[collectionName]
  );
}
