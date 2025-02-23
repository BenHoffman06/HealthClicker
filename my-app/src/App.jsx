import React from "react";
import { Routes, Route } from "react-router-dom";
import Test from "./routes/Test";

function Apps() {
  return (
    <Routes>
      <Route path="/" element={<Test/>} />
    </Routes>
  )
}

export default Apps;
