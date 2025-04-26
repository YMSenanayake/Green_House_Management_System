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

  // Fetch the finance entry data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/financial/${id}`);
        if (response.data) {
          // Format the date to YYYY-MM-DD for input field
          const formattedDate = response.data.date 
            ? new Date(response.data.date).toISOString().slice(0, 10) 
            : new Date().toISOString().slice(0, 10);
            
          setForm({
            ...response.data,
            date: formattedDate
          });
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching finance entry:", err);
        setError("Could not load finance entry data.");
        toast.error("Error loading entry data");
        
        // Default form state
        setForm({
          type: 'income',
          date: new Date().toISOString().slice(0, 10),
          category: '',
          description: '',
          amount: 0
        });
        setIsLoading(false);
      }
    };
    
    fetchData();
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
      
      await axios.put(`http://localhost:3000/api/financial/${id}`, updatedForm);
      toast.success("Finance entry updated successfully");
      onUpdate && onUpdate();
    } catch (error) {
      console.error("Error updating finance entry:", error);
      toast.error("Failed to update finance entry");
    }
  };

  if (isLoading) return <div className="text-center py-4">Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-300 mb-6">
      <h2 className="text-lg font-bold mb-4">✏️ Update Finance Entry</h2>
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">{error}</div>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Type</label>
          <select 
            name="type" 
            value={form.type} 
            onChange={handleChange} 
            className="p-3 border rounded-lg bg-white w-full"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Date</label>
          <input 
            type="date" 
            name="date" 
            value={form.date} 
            onChange={handleChange} 
            className="p-3 border rounded-lg bg-white w-full" 
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Category</label>
          <select 
            name="category" 
            value={form.category} 
            onChange={handleChange} 
            className="p-3 border rounded-lg bg-white w-full"
          >
            <option value="">Select Category</option>
            <option value="order">Order</option>
            <option value="salary">Salary</option>
            <option value="fertilizer">Fertilizer</option>
            <option value="pesticide">Pesticide</option>
            <option value="greenhouse rent">Greenhouse Rent</option>
            <option value="utility bills">Utility Bills</option>
            <option value="seed sales">Seed Sales</option>
            <option value="equipment sale">Equipment Sale</option>
            <option value="petty-cash">Petty Cash</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Description</label>
          <input 
            type="text" 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            className="p-3 border rounded-lg bg-white w-full" 
            placeholder="Enter description"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Amount (Rs.)</label>
          <input 
            type="number" 
            name="amount" 
            value={form.amount} 
            onChange={handleChange} 
            className="p-3 border rounded-lg bg-white w-full" 
            min="0"
            step="0.01"
          />
        </div>

        <div className="sm:col-span-2 flex justify-end gap-3 mt-4">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Update
          </button>
        </div>
      </div>
    </form>
  );
};

export default UpdateFinanceForm;