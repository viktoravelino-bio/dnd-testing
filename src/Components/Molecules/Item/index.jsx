import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { deleteDoc, doc } from 'firebase/firestore';
import { useState } from 'react';
import { useKanbanContext } from '../../../contexts/KanbanContext';
import { collection, COLLECTIONS } from '../../../lib/firebase';
import { ListItem } from './styles';

export function Item({ label, assignee, id, createdBy }) {
  const [isLoading, setIsLoading] = useState(false);
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
  const { load } = useKanbanContext();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,

    ...(isDragging ? { opacity: 0.5, cursor: 'grabbing' } : undefined),
  };

  async function handleDeleteTask() {
    setIsLoading(true);
    const taskRef = doc(collection(COLLECTIONS.tasks), id);
    await deleteDoc(taskRef);
    await load();
    setIsLoading(false);
  }

  return (
    <ListItem ref={setNodeRef} {...listeners} {...attributes} style={style}>
      <div>
        <h3>{label}</h3>
      </div>
      <div>
        <p>assignee: {assignee.displayName}</p>
      </div>
      {createdBy && (
        <div>
          <p>createdBy: {createdBy.displayName}</p>
        </div>
      )}
      <button disabled={isLoading} onClick={handleDeleteTask}>
        delete
      </button>
    </ListItem>
  );
}
