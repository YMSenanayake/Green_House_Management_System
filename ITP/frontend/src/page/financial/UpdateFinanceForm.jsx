import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateFinanceForm = ({ id, onUpdate, onClose }) => {
  const [form, setForm] = useState({
    type: 'income',
    date: new Date().toISOString().slice(0, 10),
    category: '',
    description: '',
    amount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the finance entry data when id changes
  useEffect(() => {
    const fetchFinanceData = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/financial/${id}`);
        
        if (response.data) {
          // Format the date for input field
          const formattedDate = response.data.date 
            ? new Date(response.data.date).toISOString().slice(0, 10) 
            : new Date().toISOString().slice(0, 10);
          
          setForm({
            type: response.data.type || 'income',
            date: formattedDate,
            category: response.data.category || '',
            description: response.data.description || '',
            amount: response.data.amount || 0
          });
        }
      } catch (err) {
        console.error("Error fetching finance data:", err);
        setError("Could not load finance entry data");
        toast.error("Error loading entry data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinanceData();
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle special case for amount to ensure it's a number
    if (name === 'amount') {
      setForm((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Ensure amount is a number
      const updatedForm = {
        ...form,
        amount: parseFloat(form.amount)
      };
      
      // Using the correct API URL for update
      await axios.put(`http://localhost:3000/api/financial/${id}`, updatedForm);
      toast.success("Finance entry updated successfully");
      
      // Call the onUpdate function if provided
      if (typeof onUpdate === 'function') {
        onUpdate();
      }
      
      // Close the form
      if (typeof onClose === 'function') {
        onClose();
      }
      
      // Reload the page after successful update
      window.location.reload();
    } catch (error) {
      console.error("Error updating finance entry:", error);
      toast.error("Failed to update finance entry");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Finance Type */}
          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
            <div className="relative">
              <select 
                name="type" 
                value={form.type} 
                onChange={handleChange} 
                className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-lg appearance-none bg-white"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input 
              type="date" 
              name="date" 
              value={form.date} 
              onChange={handleChange} 
              className="block w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" 
            />
          </div>

          {/* Category */}
          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <div className="relative">
              <select 
                name="category" 
                value={form.category} 
                onChange={handleChange} 
                className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-lg appearance-none bg-white"
              >
                <option value="">Select Category</option>
                <option value="order">Order</option>
                <option value="salary">Salary</option>
                <option value="fertilizer">Fertilizer</option>
                <option value="pesticide">Pesticide</option>
                <option value="other">Other</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Description - full width on small screens */}
          <div className="mb-1 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input 
              type="text" 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              className="block w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" 
              placeholder="Enter description"
            />
          </div>

          {/* Amount */}
          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Rs.)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₹</span>
              </div>
              <input 
                type="number" 
                name="amount" 
                value={form.amount} 
                onChange={handleChange} 
                className="block w-full pl-8 pr-3 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 rounded-md bg-green-600 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateFinanceForm;