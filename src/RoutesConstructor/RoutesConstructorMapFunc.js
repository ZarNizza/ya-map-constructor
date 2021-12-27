import React, { Component } from "react";
import PropTypes from "prop-types";

class RoutesConstructorMap extends Component {
  __state = 0;
  __Markers = [];
  __Map = {};
  __Path;

  static propTypes = {
    markers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        position: PropTypes.array.isRequired,
      })
    ).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      markers: props.markers || [],
    };
    this.mapRef = React.createRef();

    this.__init();
  }

  render() {
    var indexedMarkers = {},
      indexedPoints = {},
      points = [].slice.call(this.props.markers);

    this.__Markers.forEach(
      (item, i) => (indexedMarkers[item.id] = this.__Markers[i])
    );
    points.forEach((item, i) => (indexedPoints[item.id] = points[i]));

    this.__Markers = this.__Markers
      .filter((item) => {
        if (!!indexedPoints[item.id]) return true;

        this.__Map.geoObjects.remove(item.marker);

        return false;
      })
      .map((item) => {
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
          this.renderPath();
        });

        this.__Map.geoObjects.add(item.marker);
        this.__Markers.push(item);
      });

    this.renderPath();

    return <div className="map" ref={this.mapRef}></div>;
  }

  renderPath() {
    if (this.__state !== 2) return;

    const Polyline = new window.ymaps.Polyline(
      this.__Markers
        .sort((a, b) => a.index - b.index)
        .map((item) => item.position),
      {},
      {
        strokeColor: "#000000",
        strokeWidth: 4,
        strokeOpacity: 0.5,
      }
    );

    if (this.__Path) this.__Map.geoObjects.remove(this.__Path);

    this.__Map.geoObjects.add((this.__Path = Polyline));
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleWinResize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWinResize);
  }

  getCenter() {
    return this.__state === 2 ? this.__Map.getCenter() : [53.23, 50.16];
  }

  __init() {
    if (this.__state) return void 0;

    var That = this;
    this.__state = 1;

    window.ymaps.ready(function () {
      window.__Map = That.__Map = new window.ymaps.Map(That.mapRef.current, {
        center: That.getCenter(),
        zoom: 12,
      });
      That.__state = 2;

      window.ymaps.geocode("Самара").then(function (res) {
        That.__Map.setCenter(res.geoObjects.get(0).geometry.getCoordinates());
      });
    });
  }

  handleWinResize() {
    if (this.__state === 2) this.__Map.container.fitToViewport();
  }
}

export default RoutesConstructorMap;
