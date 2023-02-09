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
    const tasks = await Promise.all(
      querySnapshot.docs.map(async (taskDoc) => {
        const taskDocData = taskDoc.data();
        const { status: statusRef, ...taskDocDataRest } = taskDocData;

        const statusDoc = await getDoc(statusRef);

        return {
          id: taskDoc.id,
          statusId: statusDoc.id,
          ...taskDocDataRest,
        };
      })
    );

    return tasks;
  }

  return { getAllTasks, getAllStatus };
}
