import { arrayMove } from '@dnd-kit/sortable';
import { doc, writeBatch } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { db } from '../lib/firebase';
import { useFirebase } from './use-firestore';

export function useDnd() {
  const { getAllStatus, getAllTasks } = useFirebase();
  const [activeDraggingId, setActiveDraggingId] = useState(null);
  const [data, setData] = useState({});
  //   const [columns, setColumns] = useState([]);

  const columns = Object.keys(data) || [];

  useEffect(() => {
    async function fetchData() {
      try {
        const [status, tasks] = await Promise.all([
          getAllStatus(),
          getAllTasks(),
        ]);

        const statusTasksMap = status
          .sort((a, b) => {
            if (a.index < b.index) return -1;
            if (a.index > b.index) return 1;
            return 0;
          })
          .reduce((acc, status) => {
            acc[status.id] = {
              ...status,
              items: tasks
                .filter((task) => task.statusId === status.id)
                .sort((a, b) => {
                  if (a.index < b.index) return -1;
                  if (a.index > b.index) return 1;
                  return 0;
                }),
            };
            return acc;
          }, {});

        setData(statusTasksMap);
      } catch (error) {
        console.warn(error);
      }
    }

    fetchData();
  }, []);

  const findContainer = useCallback(
    (id) => {
      if (id in data) {
        return id;
      }
      return Object.keys(data).find((key) =>
        data[key].items.some((item) => item.id === id)
      );
    },
    [data]
  );

  const isActiveDraggingContainer = columns.includes(activeDraggingId);

  const activeDraggingItem =
    data[findContainer(activeDraggingId)]?.items.find(
      (item) => item.id === activeDraggingId
    ) || null;

  const handleDragStart = useCallback(({ active }) => {
    setActiveDraggingId(active.id);
  }, []);

  const handleDragOver = useCallback(
    ({ active, over }) => {
      const overId = over?.id;
      const activeId = active?.id;

      if (overId == null || activeId in data) return;

      const activeContainer = findContainer(activeId);
      const overContainer = findContainer(overId);

      if (!overContainer || !activeContainer) {
        return;
      }

      if (activeContainer === overContainer) return;

      setData((prevData) => {
        const activeColumn = prevData[activeContainer];
        const overColumn = prevData[overContainer];
        const activeItemIndex = activeColumn.items.findIndex(
          (item) => item.id === activeId
        );
        const overItemIndex = overColumn.items.findIndex(
          (item) => item.id === overId
        );

        let newIndex;

        if (overId in data) {
          newIndex = overColumn.items.length;
        } else {
          const isBelowItem =
            active?.rect?.current.translated?.top >
            over?.rect.top + over?.rect.height;

          const modifier = isBelowItem ? 1 : 0;

          newIndex =
            overItemIndex >= 0
              ? overItemIndex + modifier
              : overItems.length + 1;
        }

        return {
          ...prevData,
          [activeContainer]: {
            ...activeColumn,
            items: prevData[activeContainer].items.filter(
              (item) => item.id !== active.id
            ),
          },
          [overContainer]: {
            ...overColumn,
            items: [
              ...prevData[overContainer].items.slice(0, newIndex),
              {
                ...prevData[activeContainer].items[activeItemIndex],
                statusId: overContainer,
              },
              ...prevData[overContainer].items.slice(
                newIndex,
                prevData[overContainer].length
              ),
            ],
          },
        };
      });
    },
    [findContainer]
  );

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      const activeId = active?.id;
      const overId = over?.id;

      const activeContainer = findContainer(active.id);

      if (!activeContainer) {
        setActiveDraggingId(null);
        return;
      }

      if (overId == null) {
        setActiveDraggingId(null);
        return;
      }

      const overContainer = findContainer(overId);

      if (overContainer) {
        const activeItemIndex = data[activeContainer].items.findIndex(
          (item) => item.id === activeId
        );
        const overItemIndex = data[overContainer].items.findIndex(
          (item) => item.id === overId
        );

        if (activeItemIndex !== overItemIndex) {
          const newItemsArray = arrayMove(
            data[overContainer].items,
            activeItemIndex,
            overItemIndex
          ).map((item, index) => ({
            ...item,
            index,
          }));

          setData((prevData) => {
            return {
              ...prevData,
              [overContainer]: {
                ...prevData[overContainer],
                items: newItemsArray,
              },
            };
          });
        }
      }

      setActiveDraggingId(null);
    },
    [findContainer]
  );

  useEffect(() => {
    if (Object.keys(data).length === 0) return;
    //save data into firebase
    async function saveData() {
      try {
        // const status = await getAllStatus();
        // const tasks = await getAllTasks();
        // const statusMap = status.reduce((acc, status) => {
        //   acc[status.id] = status;
        //   return acc;
        // }, {});
        // const tasksMap = tasks.reduce((acc, task) => {
        //   acc[task.id] = task;
        //   return acc;
        // }, {});

        const newStatus = Object.values(data).map((column) => {
          //   const oldStatus = statusMap[column.id];
          const { items, ...newColumn } = column;
          return {
            ...newColumn,
            index: column.index,
          };
        });

        const newTasks = Object.values(data)
          .map((column) => column.items)
          .flat()
          .map((task) => {
            // const oldTask = tasksMap[task.id];

            return {
              ...task,
              index: task.index,
            };
          });

        const batch = writeBatch(db);

        newStatus.forEach((status) => {
          const ref = doc(db, 'status', status.id);
          batch.set(ref, status);
        });

        newTasks.forEach((task) => {
          const ref = doc(db, 'tasks', task.id);
          batch.set(ref, task);
        });

        await batch.commit();
      } catch (error) {
        console.warn(error);
      }
    }

    saveData();
  }, [data]);

  return {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    data,
    columns,
    activeDraggingItem,
  };
}
