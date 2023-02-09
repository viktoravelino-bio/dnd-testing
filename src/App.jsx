import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import { Column } from './Column';

import { columns, items } from './data/data.json';
import { useFirebase } from './hooks/use-firestore';
import { Item } from './Item';

function App() {
  const { getAllTasks, getAllStatus } = useFirebase();
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState({});
  const [columns2, setColumns2] = useState([]);

  const [columnsList, setColumnsList] = useState(
    columns.reduce((acc, column) => {
      const columnItems = items.filter((item) => item.columnId === column.id);
      acc[column.id] = {
        ...column,
        items: columnItems,
      };
      return acc;
    }, {})
  );

  useEffect(() => {
    async function load() {
      const [tasks, status] = await Promise.all([
        getAllTasks(),
        getAllStatus(),
      ]);

      const statusTasksMap = status.reduce((acc, status) => {
        acc[status.id] = {
          ...status,
          items: tasks.filter((task) => task.statusId === status.id),
        };
        return acc;
      }, {});

      setData(statusTasksMap);
      setColumns2(Object.keys(statusTasksMap));
      setIsLoading(false);
    }
    load();
  }, []);

  const sensors = useSensors(useSensor(PointerSensor));
  const [containers, setContainers] = useState(Object.keys(columnsList));
  const [draggingId, setDraggingId] = useState(null);

  function handleDragStart({ active }) {
    setDraggingId(active.id);
  }

  const findContainer = (id) => {
    if (id in columnsList) {
      return id;
    }

    return Object.keys(columnsList).find((key) =>
      columnsList[key].items.some((item) => item.id === id)
    );
  };

  function handleDragOver({ active, over }) {
    const overId = over?.id;

    if (overId == null || active.id in columnsList) {
      return;
    }

    const overContainer = findContainer(overId);
    const activeContainer = findContainer(active.id);

    if (!overContainer || !activeContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      setColumnsList((columns) => {
        const activeColumn = columns[activeContainer];
        const overColumn = columns[overContainer];
        const activeItemIndex = activeColumn.items.findIndex(
          (item) => item.id === active.id
        );
        const overItemIndex = overColumn.items.findIndex(
          (item) => item.id === overId
        );

        let newIndex;

        if (overId in columns) {
          newIndex = overColumn.length + 1;
        } else {
          const isBelowOverItem =
            active?.rect?.current.translated?.top >
            over?.rect.top + over?.rect.height;

          const modifier = isBelowOverItem ? 1 : 0;

          newIndex =
            overItemIndex >= 0
              ? overItemIndex + modifier
              : overItems.length + 1;
        }

        return {
          ...columns,
          [activeContainer]: {
            ...activeColumn,
            items: columns[activeContainer].items.filter(
              (item) => item.id !== active.id
            ),
          },
          [overContainer]: {
            ...overColumn,
            items: [
              ...columns[overContainer].items.slice(0, newIndex),
              columns[activeContainer].items[activeItemIndex],
              ...columns[overContainer].items.slice(
                newIndex,
                columns[overContainer].length
              ),
            ],
          },
        };
      });
    }
  }

  const draggingItem = containers.includes(draggingId)
    ? null
    : columnsList[findContainer(draggingId)]?.items.find(
        (item) => item.id === draggingId
      );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      // onDragStart={handleDragStart}
      // onDragOver={handleDragOver}
      // onDragEnd={() => setDraggingId(null)}
    >
      <div
        style={{
          display: 'flex',
          gap: '20px',
          padding: '20px',
          overflowX: 'auto',
        }}
      >
        <Column
          {...columnsList['column-1']}
          items={columnsList['column-1'].items}
        />
        <Column
          {...columnsList['column-2']}
          items={columnsList['column-2'].items}
        />
        <Column
          {...columnsList['column-3']}
          items={columnsList['column-3'].items}
        />
        <Column
          {...columnsList['column-4']}
          items={columnsList['column-4'].items}
        />
      </div>

      <DragOverlay>
        {draggingItem ? (
          containers.includes(draggingId) ? null : (
            <Item {...draggingItem} />
          )
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
