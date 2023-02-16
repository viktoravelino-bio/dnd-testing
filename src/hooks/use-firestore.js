import { getDoc, getDocs } from 'firebase/firestore';

import { collection } from '../lib/firebase';

async function formatDoc(doc, collectionName) {
  if (collectionName === 'tasks' && doc.data().createdBy) {
    const createdBy = await getDoc(doc.data().createdBy);
    return {
      ...doc.data(),
      createdBy: createdBy.data(),
    };
  }

  return {
    // id: doc.id,
    ...doc.data(),
  };
}

export function useFirebase() {
  async function getAllDocs(collectionName) {
    const querySnapshot = await getDocs(collection(collectionName));
    return await Promise.all(
      querySnapshot.docs.map(
        async (doc) => await formatDoc(doc, collectionName)
      )
    );
  }

  return { getAllDocs };
}
