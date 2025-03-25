import { BrowserRouter, Route, Routes } from "react-router-dom";
import toast from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

import { Toaster } from "react-hot-toast";
import C_displayitem from "././page/order/C_displayitem";
import ShoppingCart from "././page/order/ShoppingCart";
import PaymentPage from "././page/order/payment";
import CheckoutPage from "././page/order/checkout";



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />

     <Routes>
     <Route path="/c_displayitem" element={<C_displayitem/>}/>
     <Route path="shoppingCart" element={<ShoppingCart/>}/>
      <Route path="checkout" element={<CheckoutPage/>}/>
      <Route path="payment" element={<PaymentPage/>}/>



     </Routes>
     </BrowserRouter>
     
    </div>
  );
}

export default App;
