import { Item } from "../Item";

import { items } from "../../../data/data.json";
import { Children, useMemo } from "react";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { Container, Header, List } from "./styles";
import GhostItem from "../../Atoms/GhostItem";

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
    ...(isDragging ? { opacity: 0.5, cursor: "grabbing" } : undefined),
  };

  return (
    <Container ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Header status={label}><div></div>{label}</Header>

      <List>
        <SortableContext
          id={id}
          items={items}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <Item key={item.id} {...item} />
          ))}
          <GhostItem />
        </SortableContext>
      </List>
    </Container>
  );
}
