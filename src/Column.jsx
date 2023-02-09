import styled from 'styled-components';
import { Item } from './Item';

import { items } from './data/data.json';
import { Children, useMemo } from 'react';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Box = styled.div.attrs({})`
  background-color: #d3d3d3;
  height: 800px;
  width: 300px;
  border-radius: 10px;
  box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
  overflow: hidden;
  cursor: grab;
`;

const Header = styled.header.attrs({})`
  background-color: #f5f5f5;
  padding: 10px;
  font-size: 18px;
  font-weight: bold;
`;

const Body = styled.div.attrs({})`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
`;

export function Column({ label, id }) {
  const columnItems = useMemo(
    () => items.filter((item) => item.columnId === id),
    [id]
  );

  const {
    listeners,
    isDragging,
    attributes,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    data: {
      type: 'column',
      children: columnItems,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,

    ...(isDragging ? { opacity: 0, cursor: 'grabbing' } : undefined),
  };

  return (
    <Box ref={setNodeRef} {...listeners} {...attributes} style={style}>
      <Header>{label}</Header>

      <Body>
        <SortableContext
          items={columnItems}
          strategy={verticalListSortingStrategy}
        >
          {columnItems.map((item) => (
            <Item key={item.id} {...item} />
          ))}
        </SortableContext>
      </Body>
    </Box>
  );
}
