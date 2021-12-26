import React, { useState, useRef } from "react";
// import ReactDOM from "react-dom";
import RoutesConstructorMapFunc from "./RoutesConstructorMapFunc";
import "./RoutesConstructor.css";

export default function RoutesConstructorFunc() {
  const [points, setPoints] = useState([]);
  const [inpValue, setInpValue] = useState("");
  const inputRef = useRef();

  function createMarker(e) {
    e.preventDefault();
    console.log("inpValue=", inpValue);
    if (!inpValue.length) return;

    var Point = {
      id: new Date().getTime() + Math.random(),
      title: inpValue,
      position: window.__Map.getCenter(),
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

  console.log("points ", points);
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
          <div className="point-list">
            {points.map((item) => (
              <div className="point-list__item">
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
