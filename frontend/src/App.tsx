import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import MainComponent from "./components/MainComponent";

const App: React.FC = () => {
  return (
    <Router>
      <MainComponent />
    </Router>
  );
};

export default App;
