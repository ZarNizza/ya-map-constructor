import React, { useEffect, useRef } from "react";
import Sortable from "sortablejs"; // Работает!

const Sorter = React.forwardRef((props, ref) => (
  <ul ref={ref}>
    <li>item 1</li>
    <li>item 2</li>
    <li>item 3</li>
    <li>item 4</li>
    <li>item 5</li>
    <li>item 6</li>
    <li>item 7</li>
  </ul>
));

export default function App() {
  const ref1 = React.createRef();
  const ref2 = useRef();
  useEffect(() => {
    console.log("ref1-all = ", ref1, "ref2= ", ref2);
    Sortable.create(ref1.current);
  }, [ref1]);
  // useEffect(() => Sortable.create(document.getElementById("simplelist")));

  return (
    <div>
      <Sorter ref={ref1} />

      <ul id="simplelist" ref={ref2}>
        <li>item 11</li>
        <li>item 21</li>
        <li>item 31</li>
        <li>item 41</li>
        <li>item 51</li>
      </ul>
    </div>
  );
}
