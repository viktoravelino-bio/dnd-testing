import React from 'react';
import { Container } from './styles';

import Modal from 'react-modal';
import { useStoreState } from 'pullstate';
import { AppStore } from '../../../stores/AppStore';
import { collection, COLLECTIONS } from '../../../lib/firebase';
import { addDoc, doc } from 'firebase/firestore';
import { useKanbanContext } from '../../../contexts/KanbanContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

export default function GhostItem({ columnId, id }) {
  const store = useStoreState(AppStore);
  const {
    user: { uid, displayName },
  } = store;
  const { data, load, statusOptions, assigneeOptions } = useKanbanContext();

  const { attributes, transform, transition, listeners } = useSortable({
    id,
  });

  const nextIndex = data[columnId].items.length;

  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
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
      index: nextIndex,
    };

    await addDoc(collection(COLLECTIONS.tasks), {
      ...newTask,
    }).catch((err) => {
      console.log(err);
    });

    closeModal();
    load();
  }

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
        onClick={openModal}
        style={style}
      >
        Add new task
      </Container>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
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
            <select name="statusId" id="statusId" defaultValue={columnId}>
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
            {/* <input
              id="assignee"
              placeholder="status"
              name="assignee"
              value="Viktor"
            /> */}
          </div>

          <span>createdBy: {displayName}</span>
          <button type="submit">Submit</button>
        </form>
      </Modal>
    </>
  );
}
