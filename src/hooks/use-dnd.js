import { arrayMove } from '@dnd-kit/sortable';
import { doc, writeBatch } from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { COLLECTIONS, db } from '../lib/firebase';
import { findContainer, getIndex } from '../lib/utils';
import { useFirebase } from './use-firestore';

export function useDnd() {
  const { getAllDocs } = useFirebase();
  const [data, setData] = useState({});
  const [containers, setContainers] = useState([]);
  const [clonedData, setClonedData] = useState(null);
  const recentlyMovedToNewContainer = useRef(false);

  // item id that is being dragged
  const [activeDraggingId, setActiveDraggingId] = useState(null);

  // check if the item is being dragged is a container
  const isActiveDraggingItemContainer = containers.includes(activeDraggingId);

  // get the actual item that is being dragged
  const activeDraggingItem = isActiveDraggingItemContainer
    ? data[activeDraggingId]
    : data[findContainer(activeDraggingId, data)]?.items.find(
        (item) => item.id === activeDraggingId
      );

  //load the data from database
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

  useEffect(() => {
    if (Object.keys(data).length === 0) return;
  }, [data]);

  const handleDragCancel = useCallback(() => {
    if (clonedData) {
      setData(clonedData);
    }

    setActiveDraggingId(null);
    setClonedData(null);
  }, [clonedData, setClonedData, setActiveDraggingId]);

  const handleDragStart = useCallback(
    ({ active }) => {
      setActiveDraggingId(active.id);
      setClonedData(data);
    },
    [setActiveDraggingId, setClonedData, data]
  );

  const handleDragOver = useCallback(
    ({ active, over }) => {
      const overId = over?.id;
      const activeId = active.id;

      if (overId === null || activeId in data) {
        return;
      }

      const overContainer = findContainer(overId, data);
      const activeContainer = findContainer(activeId, data);

      if (!overContainer || !activeContainer) {
        return;
      }

      if (activeContainer !== overContainer) {
        setData((prevData) => {
          const activeItems = prevData[activeContainer].items;
          const overItems = prevData[overContainer].items;
          const activeIndex = getIndex(activeId, prevData);
          const overIndex = getIndex(overId, prevData);

          let newIndex;

          if (overId in prevData) {
            newIndex = overItems.length + 1;
          } else {
            const isBelowOverItem =
              active?.rect.current.translated?.top >
              over?.rect.top + over?.rect.height;

            const modifier = isBelowOverItem ? 1 : 0;

            newIndex =
              overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
          }

          recentlyMovedToNewContainer.current = true;

          return {
            ...prevData,
            [activeContainer]: {
              ...prevData[activeContainer],
              items: activeItems.filter((item) => item.id !== activeId),
            },
            [overContainer]: {
              ...prevData[overContainer],
              items: [
                ...overItems.slice(0, newIndex),
                {
                  ...activeItems[activeIndex],
                  statusId: overContainer,
                },
                ...overItems.slice(newIndex, overItems.length),
              ],
            },
          };
        });
      }
    },
    [data, setData, getIndex, findContainer]
  );

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      const overId = over?.id;
      const activeId = active.id;

      if (activeId in data && overId) {
        const activeIndex = containers.indexOf(activeId);
        const overIndex = containers.indexOf(overId);
        const newArray = arrayMove(containers, activeIndex, overIndex);

        setContainers(newArray);

        const newEntries = Object.entries(data).map(([key, values]) => {
          const containerIndex = newArray.indexOf(key);

          return [key, { ...values, index: containerIndex }];
        });

        const newDataObj = Object.fromEntries(newEntries);

        const newContainersArray = Object.values(newDataObj);

        const batch = writeBatch(db);

        newContainersArray.forEach((container) => {
          const containerRef = doc(db, COLLECTIONS.status, container.id);
          batch.update(containerRef, {
            index: container.index,
          });
        });

        batch.commit();

        setData(newDataObj);
      }

      const activeContainer = findContainer(activeId, data);

      if (!activeContainer || overId === null) {
        setActiveDraggingId(null);
        return;
      }

      const overContainer = findContainer(overId, data);
      const overItems = data[overContainer].items;

      if (overContainer) {
        const activeIndex = getIndex(activeId, data);
        const overIndex = getIndex(overId, data);

        const newTasksArray = arrayMove(overItems, activeIndex, overIndex).map(
          (item, index) => ({
            ...item,
            index,
          })
        );

        const batch = writeBatch(db);
        newTasksArray.forEach((task) => {
          const taskRef = doc(db, COLLECTIONS.tasks, task.id);
          batch.update(taskRef, {
            index: task.index,
            statusId: overContainer,
          });
        });

        batch.commit();

        if (activeIndex !== overIndex) {
          setData((prevData) => {
            return {
              ...prevData,
              [overContainer]: {
                ...prevData[overContainer],
                items: newTasksArray,
              },
            };
          });
        }
      }

      setActiveDraggingId(null);
    },
    [setActiveDraggingId, data, containers, setContainers]
  );

  return {
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    handleDragOver,
    data,
    containers,
    isActiveDraggingItemContainer,
    activeDraggingItem,
  };
}
