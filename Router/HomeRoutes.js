import React, { Component } from "react";
import { Router, Scene } from "react-native-router-flux";

import Mapview from "../Views/Mapview";

const Routes = (props) => {
  return (
    <Router>
      <Scene key="root">
        <Scene
          key="Mapview"
          component={Mapview}
          initial={true}
          title={"Mapview"}
        //   hideNavBar={true}
        />
      </Scene>
    </Router>
  );
};

export default Routes;