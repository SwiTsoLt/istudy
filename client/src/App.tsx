import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import { Controller } from "./component/controller/controller";
import { Display } from "./component/display/display";
import { Home } from "./component/home/home";

function App() {
  return (
    <Router>
      <div className="App">
        
      </div>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/display" element={<Display />}></Route>
        <Route path="/controller" element={<Controller />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
