import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from 'react-hot-toast';


import React from "react";


import Inventorydashboard from "./page/inventory/Inventorydashboard";

import Manage from "./page/inventory/Manage";
import Itemupdate from "./page/inventory/Itemupdate";
import Itemhistory from "./page/inventory/History";
import Itemfaq from "./page/inventory/Faq";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />

     <Routes>
     <Route path="/inventorydasgboard" element={<Inventorydashboard/>}/>
     <Route path="/i_manage" element={<Manage/>}/>
      <Route path="/i_update/:itemid" element={<Itemupdate/>}/>
      <Route path="/i_history" element={<Itemhistory/>}/>
      <Route path="/i_faq" element={<Itemfaq/>}/>

     </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
