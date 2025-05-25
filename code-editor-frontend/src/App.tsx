import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Questions from "./pages/Questions";
import EditorPage from "./pages/EditorPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Questions />} />
        <Route path="/editor/:id" element={<EditorPage />} />
      </Routes>
    </Router>
  );
}

