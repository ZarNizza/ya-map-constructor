import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Sortable from "sortablejs"; // Работает!
// import { arrayMove } from "react-sortable-hoc";
// import RoutesConstructorMapFunc from "./RoutesConstructorMapFunc";
import "./RoutesConstructor.css";

export default function RoutesConstructorFunc() {
  const [points, setPoints] = useState([]);
  const refSort = React.createRef();

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
    return (
      <div>
        <span className="title">{props.title}</span>
        <span className="remove" onClick={(e) => removeMarker(props.id, e)} />
      </div>
    );
  }

  const SortableList = React.forwardRef((points, ref) => (
    <div className="point-list" ref={ref}>
      {points.map((item) => (
        <SortableItem key={item.id} id={item.id} item={item} />
      ))}
    </div>
  ));

  // function handleDragEnd(event) {
  //   const active = event.oldDraggableIndex,
  //     over = event.newDraggableIndex;
  //   if (active !== over) {
  //     setPoints((items) => {
  //       const oldIndex = items.indexOf(active);
  //       const newIndex = items.indexOf(over);
  //       return arrayMove(items, oldIndex, newIndex);
  //     });
  //   }
  // }

  useEffect(
    () => Sortable.create(refSort.current),
    [refSort]
    // Sortable.create(ref, {
    //   onEnd: handleDragEnd,
    // })
  );

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
          <SortableList items={points} ref={refSort} />
        </form>
      </div>
      <div className="right-side">
        {/* <RoutesConstructorMapFunc markers={points} /> */}
      </div>
    </div>
  );
}
