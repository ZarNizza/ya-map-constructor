import React, { Component } from "react";
// import RoutesConstructor from "./RoutesConstructor/RoutesConstructor";
import RoutesConstructorFunc from "./RoutesConstructor/RoutesConstructorFunc";

class App extends Component {
  render() {
    return (
      <div>
        {/* <RoutesConstructor /> */}
        <RoutesConstructorFunc />
      </div>
    );
  }
}

export default App;
