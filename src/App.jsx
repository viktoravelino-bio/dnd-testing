import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Column } from './Column';
import { useDnd } from './hooks/use-dnd';
import { Item } from './Item';

export default function App() {
  const sensors = useSensors(useSensor(PointerSensor));

  const {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    data,
    columns,
    activeDraggingItem,
  } = useDnd();

  if (!data || !columns) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
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
        {columns.map((columnId) => (
          <Column key={columnId} {...data[columnId]} />
        ))}
      </div>

      <DragOverlay>
        {activeDraggingItem ? <Item {...activeDraggingItem} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
