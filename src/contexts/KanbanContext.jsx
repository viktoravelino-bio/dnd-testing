import { createContext, useContext, useEffect, useState } from 'react';
import { useFirebase } from '../hooks/use-firestore';
import { COLLECTIONS } from '../lib/firebase';

const KanbanContext = createContext();

export const KanbanProvider = ({ children }) => {
  const { getAllDocs } = useFirebase();
  const [data, setData] = useState({});
  const [containers, setContainers] = useState([]);
  const [clonedData, setClonedData] = useState(null);

  useEffect(() => {
    async function load() {
      const [status, tasks] = await Promise.all([
        getAllDocs(COLLECTIONS.status),
        getAllDocs(COLLECTIONS.tasks),
      ]);

      const groupedTasks = tasks.groupBy((task) => task.statusId);

      const dataObj = status
        .sort((a, b) => a.index - b.index)
        .reduce((acc, status) => {
          return {
            ...acc,
            [status.id]: {
              ...status,
              items:
                groupedTasks[status.id]?.sort((a, b) => a.index - b.index) ??
                [],
            },
          };
        }, {});

      setData(dataObj);
      setContainers(Object.keys(dataObj) || []);
    }

    load();
  }, []);

  return (
    <KanbanContext.Provider
      value={{
        data,
        containers,
        clonedData,
        setData,
        setClonedData,
        setContainers,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

export function useKanbanContext() {
  return useContext(KanbanContext);
}
