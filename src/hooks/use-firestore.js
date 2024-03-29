import { getDoc, getDocs } from "firebase/firestore";

import { collection } from "../lib/firebase";

async function formatDoc(doc, collectionName) {
  if (collectionName === "tasks" && doc.data().createdBy) {
    const [createdBy, assignee] = await Promise.all([
      getDoc(doc.data().createdBy),
      getDoc(doc.data().assignee),
    ]);

    return {
      ...doc.data(),
      createdBy: createdBy.data(),
      assignee: assignee.data(),
    };
  }

  return {
    // id: doc.id,
    ...doc.data(),
  };
}

export function useFirebase() {
  async function getAllDocs(collectionName) {
    const querySnapshot = await getDocs(collection(collectionName)).catch(
      (e) => {
        console.log(JSON.stringify(e));
      }
    );
    return await Promise.all(
      querySnapshot.docs.map(
        async (doc) => await formatDoc(doc, collectionName)
      )
    );
  }

  return { getAllDocs };
}
