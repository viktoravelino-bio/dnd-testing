import { getDocs, getDoc } from 'firebase/firestore';

import { statusCollection, tasksCollection } from '../lib/firebase';

export function useFirebase() {
  async function getAllStatus() {
    const querySnapshot = await getDocs(statusCollection);
    const status = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return status;
  }

  async function getAllTasks() {
    const querySnapshot = await getDocs(tasksCollection);
    const tasks = querySnapshot.docs.map((taskDoc) => {
      return {
        id: taskDoc.id,

        ...taskDoc.data(),
      };
    });

    return tasks;
  }

  return { getAllTasks, getAllStatus };
}
