import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddFinanceForm = ({ onSubmit, onCancel }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: 'income',
    date: new Date().toISOString().slice(0, 10),
    category: 'order',
    description: '',
    amount: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!form.category || !form.description || !form.amount) {
      toast.error('Please fill all required fields');
      return;
    }

    // Prepare data - ensure amount is a number
    const financeData = {
      ...form,
      amount: parseFloat(form.amount)
    };

    try {
      setIsLoading(true);
      
      // Submit form
      if (onSubmit) {
        await onSubmit(financeData);
      }
      
      // Reset form
      setForm({
        type: 'income',
        date: new Date().toISOString().slice(0, 10),
        category: 'order',
        description: '',
        amount: ''
      });
      
      toast.success('Finance entry added successfully');
      
      // Navigate to financial list page after successful submission
      navigate('/financialist');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to add finance entry');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-green-200 mb-8">
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 rounded-t-lg">
        <h2 className="text-lg font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Finance Entry
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
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

          {/* Description - full width on all devices */}
          <div className="mb-1 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input 
              type="text" 
              name="description" 
              placeholder="Enter a detailed description" 
              value={form.description} 
              onChange={handleChange} 
              className="block w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" 
            />
          </div>

          {/* Amount */}
          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Rs.)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">Rs</span>
              </div>
              <input 
                type="number" 
                name="amount" 
                placeholder="0.00" 
                value={form.amount} 
                onChange={handleChange} 
                className="block w-full pl-8  pr-3 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" 
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isLoading}
            className={`px-6 py-2 rounded-md bg-green-600 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Entry
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFinanceForm;