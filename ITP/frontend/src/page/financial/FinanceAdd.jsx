import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddFinanceForm from './components/AddFinanceForm';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

const FinanceAddPage = () => {
  const [financeData, setFinanceData] = useState([]);
  
  // Define fetchData function to be passed to AddFinanceForm
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/financial');
      setFinanceData(response.data);
    } catch (error) {
      console.error('Error fetching finance data:', error);
    }
  };
  
  // Load initial data
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64 mt-20 container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-center mb-6">Finance Management</h1>
          <AddFinanceForm onSubmit={fetchData} />
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default FinanceAddPage;