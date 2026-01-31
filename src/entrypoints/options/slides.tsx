import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import React from "react";
import { Box } from "@mui/material";
import { CSS } from "@dnd-kit/utilities";
import { ScrollToTopButton } from "@/components/scroll";

type SortableItemProps = {
  id: number;
};

const SortableItem = (props: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: (theme) => theme.palette.primary.main,
        borderRadius: (theme) => theme.shape.borderRadius,

        aspectRatio: "1/1",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        fontSize: 36,
      }}
    >
      {props.id}
    </Box>
  );
};

const makeNumbers = () => {
  return Array.from({ length: 20 }, (_, index) => index);
};

export const Component = () => {
  const [items, setItems] = React.useState(makeNumbers);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <>
      <ScrollToTopButton />
      <Box sx={{ paddingBlock: 3 }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => {
            const { active, over } = event;

            if (!active) return;
            if (!over) return;
            if (active.id === over.id) {
              return;
            }

            setItems((items) => {
              const oldIndex = items.indexOf(+active.id);
              const newIndex = items.indexOf(+over.id);

              return arrayMove(items, oldIndex, newIndex);
            });
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(6,minmax(0,1fr))",
              gap: 1,
            }}
          >
            <SortableContext
              items={items}
              strategy={horizontalListSortingStrategy}
            >
              {items.map((id) => (
                <SortableItem key={id} id={id} />
              ))}
            </SortableContext>
          </Box>
        </DndContext>
      </Box>
    </>
  );
};
