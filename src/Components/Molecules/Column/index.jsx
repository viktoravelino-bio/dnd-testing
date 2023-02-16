import { Item } from '../Item';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AddButton, Container, Header, List } from './styles';
import GhostItem from '../../Atoms/GhostItem';

import Modal from 'react-modal';
import { useKanbanContext } from '../../../contexts/KanbanContext';
import { AppStore } from '../../../stores/AppStore';
import { useStoreState } from 'pullstate';
import { useState } from 'react';
import { addDoc, doc } from 'firebase/firestore';
import { collection, COLLECTIONS } from '../../../lib/firebase';
Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export function Column({ label, id, items }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const store = useStoreState(AppStore);
  const {
    user: { uid, displayName },
  } = store;
  const { data, load, statusOptions, assigneeOptions } = useKanbanContext();

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

  function openModal() {
    setIsModalOpen(true);
  }
  function closeModal() {
    setIsModalOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataEntries = Object.fromEntries(formData.entries());

    console.log(formDataEntries);

    const newTask = {
      ...formDataEntries,
      createdBy: doc(collection(COLLECTIONS.users), uid),
      assignee: doc(collection(COLLECTIONS.users), formDataEntries.assignee),
      index: data[formDataEntries.statusId].items.length,
    };

    console.log(newTask);
    await addDoc(collection(COLLECTIONS.tasks), {
      ...newTask,
    }).catch((err) => {
      console.log(err);
    });

    closeModal();
    load();
  }
  return (
    <>
      <Container ref={setNodeRef} style={style} {...listeners} {...attributes}>
        <Header status={label}>
          {label}
          <AddButton onClick={openModal}>+</AddButton>
        </Header>

        <List>
          <SortableContext
            id={id}
            items={[...items, { id: `ghost-${id}` }]}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <Item key={item.id} {...item} />
            ))}
            <GhostItem id={`ghost-${id}`} onClick={openModal} />
          </SortableContext>
        </List>
      </Container>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="New Task"
      >
        <button onClick={closeModal}>close</button>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div>
            <label htmlFor="label">Label: </label>
            <input id="label" placeholder="label" name="label" />
          </div>

          <div>
            <label htmlFor="status">Status: </label>
            <select name="statusId" id="statusId" defaultValue={id}>
              {statusOptions?.map((status) => (
                <option
                  key={status.id}
                  value={status.id}
                  label={status.label}
                />
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="assignee">Assignee: </label>
            <select id="assignee" name="assignee">
              {assigneeOptions?.map((assignee) => (
                <option
                  key={assignee.id}
                  value={assignee.id}
                  label={assignee.displayName}
                />
              ))}
            </select>
          </div>

          <span>createdBy: {displayName}</span>
          <button type="submit">Submit</button>
        </form>
      </Modal>
    </>
  );
}
