import React from "react";
import Authentication from "./Authentication.jsx";
import Kitchen from "./Kitchen"
import HouseKeeping from "./HouseKeeping"

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


function App() {

  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Authentication} />
        <Route path="/Kitchen" component={Kitchen} /> 
        <Route path="/HouseKeeping" component={HouseKeeping} /> 
        <Route path="/Authentication" />
      </Switch>
    </Router>
  );
}

export default App;
