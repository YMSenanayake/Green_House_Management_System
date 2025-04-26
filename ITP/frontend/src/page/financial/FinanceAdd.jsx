import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddFinanceForm from './components/AddFinanceForm';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FinanceAddPage = () => {
  const [financeData, setFinanceData] = useState([]);
  
  // Define handleAddFinance function to be passed to AddFinanceForm
  const handleAddFinance = async (formData) => {
    try {
      // This is the correct way to add new financial data
      const response = await axios.post('http://localhost:3000/api/financial', formData);
      
      if (response.data) {
        setFinanceData(prev => [...prev, response.data]);
        return true; // Return true to indicate success
      }
    } catch (error) {
      console.error('Error adding finance data:', error);
      toast.error('Failed to add finance entry');
      throw error; // Throw error so the form component can handle it
    }
  };
  
  // Load initial data (optional)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/financial');
        if (Array.isArray(response.data)) {
          setFinanceData(response.data);
        }
      } catch (error) {
        console.error('Error fetching initial finance data:', error);
      }
    };
    
    fetchInitialData();
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64 mt-20 container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Add Financial Entry</h1>
            <p className="text-gray-600 text-center">Create a new income or expense record</p>
          </div>
          
          <AddFinanceForm 
            onSubmit={handleAddFinance} 
            onCancel={() => window.history.back()} 
          />
          
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Financial List
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FinanceAddPage;