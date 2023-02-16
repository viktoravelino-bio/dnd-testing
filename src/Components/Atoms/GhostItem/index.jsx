import React from 'react';
import { Container } from './styles';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function GhostItem({ id ,onClick}) {
  const { attributes, transform, transition, listeners } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <Container
        // ref={setNodeRef}
        {...attributes}
        {...listeners}
        onClick={onClick}
        style={style}
      >
        Add new task
      </Container>
    </>
  );
}
