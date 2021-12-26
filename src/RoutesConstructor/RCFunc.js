import React, { useState, useRef, useEffect } from "react";
// import ReactDOM from "react-dom";
import Sortable from "sortablejs";
import { arrayMoveImmutable } from "array-move";
import RoutesConstructorMapFunc from "./RoutesConstructorMapFunc";
import "./RoutesConstructor.css";

export default function RoutesConstructorFunc() {
  const [points, setPoints] = useState([]);
  const [inpValue, setInpValue] = useState("");
  const inputRef = useRef();
  const listRef = useRef();

  function createMarker(e) {
    e.preventDefault();
    if (!inpValue.length) return;

    var Point = {
      id: new Date().getTime() + Math.random(),
      title: inpValue,
      position: window.__Map.getCenter(),
      index: points.length,
    };

    setPoints((prev) => [...prev, Point]);
    inputRef.current.value = "";
    return;
  }

  function removeMarker(id, e) {
    e.stopPropagation();
    setPoints(points.filter((item) => item.id !== id));
    return;
  }

  function handleSortEnd(event) {
    const oldIndex = event.oldIndex,
      newIndex = event.newIndex;
    console.log("old/new ", oldIndex, newIndex);
    console.log("points ", points);

    if (oldIndex !== newIndex) {
      setPoints(
        arrayMoveImmutable(points, oldIndex, newIndex).map((item, i) => {
          item.index = i;
          return item;
        })
      );
    }
    return;
  }

  useEffect(() => {
    Sortable.create(listRef.current, { onEnd: handleSortEnd });
  });

  console.log("----- points ", points);

  return (
    <div className="routes-constructor">
      <div className="left-side">
        <form onSubmit={createMarker} method="post">
          <div className="input">
            <input
              type="text"
              ref={inputRef}
              defaultValue=""
              onChange={(e) => setInpValue(e.target.value.trim())}
              placeholder="Новая точка маршрута"
            />
          </div>
          <div className="point-list" ref={listRef}>
            {points.map((item) => (
              <div className="point-list__item" key={item.id}>
                <span className="title">{item.title}</span>
                <span
                  className="remove"
                  onClick={(e) => removeMarker(item.id, e)}
                />
              </div>
            ))}
          </div>
        </form>
      </div>
      <div className="right-side">
        <RoutesConstructorMapFunc markers={points} />
      </div>
    </div>
  );
}
