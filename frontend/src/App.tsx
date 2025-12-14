import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AnalysisPage from "./pages/MainPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AnalysisPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
