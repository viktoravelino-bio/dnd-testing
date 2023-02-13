import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import { Column } from './Components/Molecules/Column';

import { useDnd } from './hooks/use-dnd';
import { Item } from './Components/Molecules/Item';

export default function App() {
  const {
    handleDragEnd,
    handleDragStart,
    handleDragCancel,
    handleDragOver,
    data,
    containers,
    isActiveDraggingItemContainer,
    activeDraggingItem,
  } = useDnd();
  const sensors = useSensors(useSensor(PointerSensor));

  if (containers.length === 0) {
    return <h1>Loading...</h1>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragCancel={handleDragCancel}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div
        style={{
          display: 'flex',
          gap: '20px',
          padding: '20px',
          overflowX: 'auto',
        }}
      >
        <SortableContext
          id="columns"
          items={containers}
          strategy={horizontalListSortingStrategy}
        >
          {containers.map((columnId) => (
            <Column key={columnId} {...data[columnId]} />
          ))}
        </SortableContext>
      </div>

      <DragOverlay>
        {activeDraggingItem ? (
          isActiveDraggingItemContainer ? (
            <Column {...data[activeDraggingItem.id]} />
          ) : (
            <Item {...activeDraggingItem} />
          )
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
