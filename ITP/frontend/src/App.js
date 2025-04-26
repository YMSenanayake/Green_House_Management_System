import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

import Machine from "./page/machine/Machine";
import MachineUpdate from "./page/machine/MachineUpdate";
import {MachinePdf} from "./page/machine/MachinePdf";
import {MVehicle} from "./page/machine/MVehicle";
import Machinedashboard from "./page/machine/Machinedashboard";



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer position="top-center" autoClose={3000} />
        <Routes>
          <Route path="/m_machine" element={<Machine />} />
          <Route path="/m_update/:mid" element={<MachineUpdate />} />
          <Route path="/m_MachinePdf" element={<MachinePdf />} />
          <Route path="/m_MVehicle" element={<MVehicle />} />
          <Route path="/m_machinedashboard" element={<Machinedashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
