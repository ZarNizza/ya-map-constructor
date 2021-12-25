import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import RoutesConstructorMapFunc from "./RoutesConstructorMapFunc";
import "./RoutesConstructor.css";

export default function RoutesConstructorFunc() {
  const [points, setPoints] = useState([]);
  const sensors = useSensors(
    useSensors(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function createMarker(e) {
    e.preventDefault();

    var Node = ReactDOM.findDOMNode(this.refs.markerName);
    if (!Node.value.trim().length) return;

    var Point = {
      id: new Date().getTime() + Math.random(),
      title: Node.value.trim(),
      position: window.__Map.getCenter(),
      index: points.length,
    };

    setPoints(...Point);
    Node.value = "";
    return;
  }

  function removeMarker(id, e) {
    e.stopPropagation();
    setPoints(points.filter((item) => item.id !== id));
    return;
  }

  function SortableItem(props) {
    // const {arguments, listeners, setNodeRef} = useDraggable({ id:props.id, });
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: props.id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    return (
      <div
        className="point-list__item"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        {...arguments}
      >
        <span className="title">{props.title}</span>
        <span className="remove" onClick={(e) => removeMarker(props.id, e)} />
      </div>
    );
  }

  function SortableList({ points }) {
    return (
      <div className="point-list">
        {points.map((item) => (
          <SortableItem key={item.id} id={item.id} item={item} />
        ))}
      </div>
    );
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setPoints((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="routes-constructor" ref="routesConstructor">
      <div className="left-side">
        <form onSubmit={createMarker} method="post">
          <div className="input">
            <input
              type="text"
              ref="markerName"
              defaultValue=""
              placeholder="Новая точка маршрута"
            />
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={points}
              strategy={verticalListSortingStrategy}
            >
              <SortableList items={points} />
            </SortableContext>
          </DndContext>
        </form>
      </div>
      <div className="right-side">
        <RoutesConstructorMapFunc markers={points} />
      </div>
    </div>
  );
}
