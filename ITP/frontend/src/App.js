import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/login/index.jsx"; 
import Signup from "./components/register/index.js";
import Homepage from "./components/home/index.js";

function App() {
  return (
     <Router>
      <Routes>
      <Route path="/" element={<Homepage/>}/>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />


      
      </Routes>
    </Router>
  );
}

export default App;
