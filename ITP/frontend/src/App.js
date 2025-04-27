import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



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

import Machine from "./page/machine/Machine";
import MachineUpdate from "./page/machine/MachineUpdate";
import {MachinePdf} from "./page/machine/MachinePdf";
import {MVehicle} from "./page/machine/MVehicle";
import Machinedashboard from "./page/machine/Machinedashboard";


import { useAppContext } from './context/AppContext';
import Navbar from "./components/cart/Navbar";
import Login from "./components/cart/Login"
import CartHome from './page/cart/Home'
import { Toaster } from "react-hot-toast";
import AllProducts from './page/cart/AllProducts';
import ProductCategory from './page/cart/ProductCategory';
import ProductDetails from './page/cart/ProductDetails';
import Cart from './page/cart/Cart';
import AddAddress from './page/cart/AddAddress';
import MyOrders from './page/cart/MyOrders';
import Loading from './components/cart/Loading';

function App() {
  const isSellerPath = useLocation().pathname.includes("seller");
  const {showUserLogin, isSeller} = useAppContext()
  return (

   <div>
       

       <ToastContainer position="top-center" autoClose={3000} />

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
        <Route path="/inventorydashboard" element={<InventoryDashboard/>}/>
        <Route path="/productlist" element={<ProductList/>}/>
        <Route path="/fhinancialdashboard" element={<FinancePage/>}/>
        <Route path="/addfinacial" element={<FinanceAdd/>}/>
        <Route path="/financialist" element={<FInancialList/>}/>

        <Route path="/m_machine" element={<Machine />} />
          <Route path="/m_update/:mid" element={<MachineUpdate />} />
          <Route path="/m_MachinePdf" element={<MachinePdf />} />
          <Route path="/m_MVehicle" element={<MVehicle />} />
          <Route path="/m_machinedashboard" element={<Machinedashboard />} />



      </Routes>
      <div className='text-default min-h-screen text-gray-700 bg-white '>
      {isSellerPath ? null : <Navbar/>} 
      {showUserLogin ? <Login/> : null}
      <Toaster />
        <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
          <Routes>
            
              <Route path='/cartHome' element={<CartHome/>} />
              <Route path='/products' element={<AllProducts/>} />
               <Route path='/products/:category' element={<ProductCategory/>} />
              <Route path='/products/:category/:id' element={<ProductDetails/>} />
              <Route path='/cart' element={<Cart/>} />
              <Route path='/add-address' element={<AddAddress/>} />
              <Route path='/my-orders' element={<MyOrders/>} />
              <Route path='/loader' element={<Loading/>} />
             
            </Routes>
          </div>
      </div>
      {/* {!isSellerPath && <Footer/>} */}
  
  </div>

    
  );
}

export default App;
