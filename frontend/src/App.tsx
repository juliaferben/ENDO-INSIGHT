import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./pages/NavBar";
import AnalysisPage from "./pages/PatientPage";
import ModelPage from "./pages/ModelPage";
import BayesianPage from "./pages/BayesianPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ paddingTop: "70px" }}>
        <Routes>
          <Route path="/" element={<AnalysisPage />} />
          <Route path="/bayesian" element={<BayesianPage />} />
          <Route path="/model-info" element={<ModelPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
