import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styled from 'styled-components';

const ItemWrapper = styled.div`
  background-color: #f5f5;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 0 3px 0px rgba(0, 0, 0, 0.2);
  cursor: grab;
`;

export function Item({ label, id }) {
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

    ...(isDragging ? { opacity: 0, cursor: 'grabbing' } : undefined),
  };

  return (
    <ItemWrapper ref={setNodeRef} {...listeners} {...attributes} style={style}>
      {label}
    </ItemWrapper>
  );
}
