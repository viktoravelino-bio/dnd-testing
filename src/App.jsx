import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { Column } from './Column';

import { columns, items } from './data/data.json';
import { Item } from './Item';

function App() {
  const sensors = useSensors(useSensor(PointerSensor));
  const [draggingId, setDraggingId] = useState(null);

  const draggingItem =
    columns.find((column) => column.id === draggingId) ||
    items.find((item) => item.id === draggingId);

  console.log('draggingId', draggingItem);
  function handleDragStart(event) {
    setDraggingId(event.active.id);
  }

  function handleDragEnd(event) {
    setDraggingId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={columns} strategy={horizontalListSortingStrategy}>
        <div className="app">
          <div
            style={{
              display: 'flex',
              marginTop: '30px',
              padding: '30px 30px',
              overflowX: 'auto',
              gap: '20px',
              position: 'relative',
            }}
          >
            {columns.map((column) => (
              <Column key={column.id} {...column} />
            ))}
          </div>
        </div>
      </SortableContext>
      <DragOverlay>
        {draggingId ? (
          columns.includes(draggingItem) ? (
            <Column {...draggingItem} />
          ) : (
            <Item {...draggingItem} />
          )
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
