import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ListItem } from './styles';

export function Item({ label, assignee, id, createdBy }) {
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
    <ListItem ref={setNodeRef} {...listeners} {...attributes} style={style}>
      <div>
        <h3>{label}</h3>
      </div>
      <div>
        <p>assignee: {assignee}</p>
      </div>
      {createdBy && (
        <div>
          <p>createdBy: {createdBy.displayName}</p>
        </div>
      )}
    </ListItem>
  );
}
