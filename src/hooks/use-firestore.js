import { getDocs } from 'firebase/firestore';

import { collection } from '../lib/firebase';

function formatDoc(doc) {
  return {
    id: doc.id,
    ...doc.data(),
  };
}

export function useFirebase() {
  async function getAllDocs(collectionName) {
    const querySnapshot = await getDocs(collection(collectionName));
    return querySnapshot.docs.map(formatDoc);
  }

  return { getAllDocs };
}
