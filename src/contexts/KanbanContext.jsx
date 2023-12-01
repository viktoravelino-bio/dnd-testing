import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useFirebase } from "../hooks/use-firestore";
import { COLLECTIONS } from "../lib/firebase";

const KanbanContext = createContext();

export const KanbanProvider = ({ children }) => {
  const { getAllDocs } = useFirebase();
  const [data, setData] = useState({});
  const [containers, setContainers] = useState([]);
  const [clonedData, setClonedData] = useState(null);
  const [statusOptions, setStatusOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);

  const load = useCallback(async () => {
    const [status, tasks, users] = await Promise.all([
      getAllDocs(COLLECTIONS.status),
      getAllDocs(COLLECTIONS.tasks),
      getAllDocs(COLLECTIONS.users),
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
              groupedTasks[status.id]?.sort((a, b) => a.index - b.index) ?? [],
          },
        };
      }, {});

    setData(dataObj);
    setContainers(Object.keys(dataObj) || []);
    setStatusOptions(status);
    setAssigneeOptions(users);
  }, [setData, setContainers]);

  useEffect(() => {
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
        load,
        statusOptions,
        assigneeOptions,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

export function useKanbanContext() {
  return useContext(KanbanContext);
}
