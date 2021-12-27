import React, { useState, useRef, useEffect } from "react";

export default function RoutesConstructorMap(props) {
  const [state, setState] = useState(0);
  let __Map = {};
  let __Path;
  let Markers = [];
  // const [Markers, setMarkers] = useState(props.markers || []);
  const mapRef = useRef();
  __init();

  function renderPath() {
    if (state !== 2) return;

    const Polyline = new window.ymaps.Polyline(
      Markers.sort((a, b) => a.index - b.index).map((item) => item.position),
      {},
      {
        strokeColor: "#000000",
        strokeWidth: 4,
        strokeOpacity: 0.5,
      }
    );

    if (__Path) __Map.geoObjects.remove(__Path);

    __Map.geoObjects.add((__Path = Polyline));
  }

  function getCenter() {
    return state === 2 ? __Map.getCenter() : [53.23, 50.16];
  }

  function __init() {
    if (state) return void 0;
    console.log("------ Init");
    setState(1);

    window.ymaps.ready(function () {
      window.__Map = __Map = new window.ymaps.Map(mapRef.current, {
        center: getCenter(),
        zoom: 12,
      });
      setState(2);

      window.ymaps.geocode("Самара").then(function (res) {
        __Map.setCenter(res.geoObjects.get(0).geometry.getCoordinates());
      });
    });
  }

  // useEffect(() => {
  //   if (state === 2) __Map.container.fitToViewport();
  // }, []);

  ////////////////////////////////////////////////////////////

  var indexedMarkers = {},
    indexedPoints = {},
    points = [].slice.call(props.markers);

  Markers.forEach((item, i) => (indexedMarkers[item.id] = Markers[i]));
  points.forEach((item, i) => (indexedPoints[item.id] = points[i]));

  Markers = Markers.filter((item) => {
    if (!!indexedPoints[item.id]) return true;

    __Map.geoObjects.remove(item.marker);

    return false;
  }).map((item) => {
    item.index = indexedPoints[item.id].index;

    return item;
  });

  points
    .filter((item) => !indexedMarkers[item.id])
    .forEach((item) => {
      item.marker = new window.ymaps.Placemark(
        item.position,
        {
          balloonContent: item.title,
        },
        {
          draggable: true,
        }
      );

      item.marker.events.add("dragend", (e) => {
        item.position = e.get("target").geometry.getCoordinates();
        renderPath();
      });

      __Map.geoObjects.add(item.marker);
      Markers.push(item);
    });

  renderPath();

  return <div className="map" ref={mapRef}></div>;
}
