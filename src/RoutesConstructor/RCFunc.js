import React, { useState, useRef } from "react";
import { ReactSortable } from "react-sortablejs";
// import RoutesConstructorMapFunc from "./RCMapFunc";
import RoutesConstructorMapFunc from "./RoutesConstructorMap";
import "./RC.css";

export default function RoutesConstructorFunc() {
  const [points, setPoints] = useState([]);
  const [inpValue, setInpValue] = useState("");
  const inputRef = useRef();

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
    if (event.oldIndex !== event.newIndex) {
      setPoints(
        points.map((item, i) => {
          item.index = i;
          return item;
        })
      );
    }
  }

  return (
    <div className="routes-constructor">
      <div className="left-side">
        <p className="compact-text">
          Вводите названия точек маршрута, точки позиционируются в центр карты,
          карту можно двигать. Порядок точек в списке можно менять
          перетаскиванием.
        </p>
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
          <div className="point-list">
            <ReactSortable
              list={points}
              setList={setPoints}
              onEnd={handleSortEnd}
              ghostClass="blue-background-class"
            >
              {points.map((item) => (
                <div className="point-list__item" key={item.id}>
                  <span className="title">{item.title}</span>
                  <span
                    className="remove"
                    onClick={(e) => removeMarker(item.id, e)}
                  />
                </div>
              ))}
            </ReactSortable>
          </div>
        </form>
      </div>
      <div className="right-side">
        <RoutesConstructorMapFunc markers={points} />
      </div>
    </div>
  );
}
