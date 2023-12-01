// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection as fbCollection, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const COLLECTIONS = {
  status: "status",
  tasks: "tasks",
  users: "users",
};

export const converters = {
  //   status: {
  //     toFirestore: (status) => {
  //       return {
  //         label: status.label,
  //         index: status.index,
  //         assignee: status.assignee,
  //       };
  //     },
  //     fromFirestore: (snapshot, options) => {
  //       const data = snapshot.data(options);
  //       return {
  //         id: snapshot.id,
  //         label: data.label,
  //         index: data.index,
  //         assignee: data.assignee,
  //       };
  //     },
  //   },
  // tasks: {
  //   toFirestore: (task) => {
  //     const { id, ...docData } = task;
  //     return docData;
  //   },
  //   fromFirestore: (snapshot, options) => {
  //     const data = snapshot.data(options);
  //     return {
  //       id: snapshot.id,
  //       ...data,
  //     };
  //   },
  // },
  default: {
    toFirestore: (doc) => {
      const { id, ...docData } = doc;
      return docData;
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return {
        id: snapshot.id,
        ...data,
      };
    },
  },
};

export function collection(collectionName) {
  const converter = converters[collectionName] ?? converters.default;
  return fbCollection(db, collectionName).withConverter(converter);
}
