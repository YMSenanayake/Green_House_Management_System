import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



import SignIn from "./components/login/index"; 
import Signup from "./components/register/index";
import Homepage from "./components/home/index";
import Employeedashboard from "./page/emplyee/Employeedashboard";
import Allusers from "./page/emplyee/Allusers";
import Approveleave from "./page/emplyee/Approveleave";
import Edidemployeeprofile from "./page/emplyee/Edidemployeeprofile";
import Employeeattendance from "./page/emplyee/Employeeattendance";
import Employeeprofiledashboard from "./page/emplyee/Employeeprofiledashboard";
import Euserprofile from "./page/emplyee/Euserprofile";
import Forgopassword from './page/emplyee/Forgopassword'
import Requestedleave from "./page/emplyee/Requestedleave";
import Userupdate from "./page/emplyee/Userupdate";

function App() {
  return (
     <Router>
      <Routes>
      <Route path="/" element={<Homepage/>}/>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/employeeDashboard" element={<Employeedashboard/>}/>
        <Route path="/e_allusers" element={<Allusers/>}/>
        <Route path="e_approveleave" element={<Approveleave/>}/>
        <Route path="/e_editprofile/:uid" element={<Edidemployeeprofile/>}/>
        <Route path="/e_profile_dashboard" element={<Employeeprofiledashboard/>}/>
        <Route path="/e_atendancde" element={<Employeeattendance/>}/>
        <Route path="e_userprofile/:empid" element={<Euserprofile/>}/>
        <Route path="/forgot-password" element={<Forgopassword/>}/>
        <Route path="e_requestedleave" element={<Requestedleave/>}/>
        <Route path="/e_updates/:userid" element={<Userupdate/>}/>

      </Routes>
    </Router>
  );
}

export default App;
