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
import { useDroppable } from '@dnd-kit/core';

const Box = styled.div.attrs({})`
  background-color: #d3d3d3;
  height: 800px;
  width: 300px;
  border-radius: 10px;
  box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
  overflow: hidden;
  border: 2px solid red;
  /* cursor: grab; */
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

export function Column({ label, id, children, items }) {
  const {
    listeners,
    attributes,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { opacity: 0.5, cursor: 'grabbing' } : undefined),
  };

  return (
    <Box ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Header>{label}</Header>

      <Body>
        <SortableContext
          id={id}
          items={items}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <Item key={item.id} {...item} />
          ))}
        </SortableContext>
      </Body>
    </Box>
  );
}
