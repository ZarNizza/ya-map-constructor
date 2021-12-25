// !!! This Dnd-kit is beta and even default tutorial do not work...
//Failed to compile.
//
// ./node_modules/@dnd-kit/core/dist/core.esm.js
// Module parse failed: Unexpected token (132:15)
// You may need an appropriate loader to handle this file type.
// |   switch (action.type) {
// |     case Action.DragStart:
// |       return { ...state,
// |         draggable: { ...state.draggable,
// |           initialCoordinates: action.initialCoordinates,
//

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// import { SortableItem } from "./SortableItem";

export default function App() {
  const [items, setItems] = useState(["1", "2", "3"]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      YOHOHO!
      {/* <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((id) => (
          <SortableItem key={id} id={id} />
        ))}
      </SortableContext> */}
    </DndContext>
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
}
