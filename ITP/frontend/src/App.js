import { BrowserRouter, Route, Routes,Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

import Machine from "./page/machine/Machine";
import MachineUpdate from "./page/machine/MachineUpdate";
import {MachinePdf} from "./page/machine/MachinePdf";
import {MVehicle} from "./page/machine/MVehicle";
import Machinedashboard from "./page/machine/Machinedashboard";



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
import InventoryDashboard from "./page/inventory/inventoryDashboard";
import ProductList from "./page/inventory/productList";
import FinancePage from './page/financial/FinanceDashboard';
import FinanceAdd from './page/financial/FinanceAdd';
import FInancialList from './page/financial/FinanceList';



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        
      </BrowserRouter>
    
     <Router>
      <Routes>
      <ToastContainer position="top-center" autoClose={3000} />
        <Routes>
          <Route path="/m_machine" element={<Machine />} />
          <Route path="/m_update/:mid" element={<MachineUpdate />} />
          <Route path="/m_MachinePdf" element={<MachinePdf />} />
          <Route path="/m_MVehicle" element={<MVehicle />} />
          <Route path="/m_machinedashboard" element={<Machinedashboard />} />
        </Routes>
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
        <Route path="/inventorydashboard" element={<InventoryDashboard/>}/>
        <Route path="/productlist" element={<ProductList/>}/>
        <Route path="/fhinancialdashboard" element={<FinancePage/>}/>
        <Route path="/addfinacial" element={<FinanceAdd/>}/>
        <Route path="/financialist" element={<FInancialList/>}/>

      </Routes>
    </Router>
    </div>
  );
}

export default App;
