import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

// Professional color palette
const COLORS = ['#4ade80', '#f87171', '#60a5fa', '#facc15', '#a78bfa', '#fb923c'];
const CHART_COLORS = {
  income: '#10b981',
  expense: '#ef4444',
  balance: '#3b82f6'
};

const FinanceDashboard = ({ data }) => {
  const [totals, setTotals] = useState({ income: 0, expense: 0 });
  const [salaries, setSalaries] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      calculateTotals(data);
      
      // Filter salary data from financial entries
      const salaryData = data.filter(entry => 
        entry.type === 'expense' && entry.category.toLowerCase() === 'salary'
      );
      setSalaries(salaryData);
    }
  }, [data]);

  const calculateTotals = (data) => {
    const income = data.filter(d => d.type === 'income').reduce((sum, d) => sum + d.amount, 0);
    const expense = data.filter(d => d.type === 'expense').reduce((sum, d) => sum + d.amount, 0);
    setTotals({ income, expense });
  };

  const formatCurrency = (value) => {
    return `Rs. ${value.toLocaleString('en-IN')}`;
  };

  const groupedByCategory = (type) => {
    if (!data || data.length === 0) return [];
    
    const filtered = data.filter(e => e.type === type);
    const grouped = {};

    filtered.forEach(entry => {
      if (grouped[entry.category]) {
        grouped[entry.category] += entry.amount;
      } else {
        grouped[entry.category] = entry.amount;
      }
    });

    return Object.keys(grouped).map((key) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' '),
      value: grouped[key]
    }));
  };

  const incomeData = groupedByCategory('income');
  const expenseData = groupedByCategory('expense');

  // Calculate balance
  const balance = totals.income - totals.expense;
  const balanceStatus = balance >= 0 ? 'positive' : 'negative';

  // Custom Tooltip styles
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded border border-gray-200">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-gray-700">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="my-10">
      

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-green-100">
          <div className="bg-green-50 p-3 flex justify-between items-center">
            <h3 className="text-green-800 font-semibold">Total Income</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="p-6">
            <p className="text-3xl font-bold text-green-600">{formatCurrency(totals.income)}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-red-100">
          <div className="bg-red-50 p-3 flex justify-between items-center">
            <h3 className="text-red-800 font-semibold">Total Expense</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="p-6">
            <p className="text-3xl font-bold text-red-600">{formatCurrency(totals.expense)}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-blue-100">
          <div className="bg-blue-50 p-3 flex justify-between items-center">
            <h3 className="text-blue-800 font-semibold">Balance</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <div className="p-6">
            <p className={`text-3xl font-bold ${balanceStatus === 'positive' ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Pie Chart - Income */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Income by Category</h3>
          {incomeData.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No income data to display</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={60}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {incomeData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart - Expenses */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Expenses by Category</h3>
          {expenseData.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No expense data to display</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expenseData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="value" fill="#f87171" radius={[4, 4, 0, 0]}>
                  {expenseData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[(i + 2) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Salaries Paid Section */}
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-800">Recent Salary Payments</h3>
          <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {salaries.length} payments
          </span>
        </div>
        
        {salaries.length === 0 ? (
          <div className="flex justify-center items-center py-8 text-gray-500">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>No salary payment records found</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {salaries.map(salary => (
                  <tr key={salary._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-700">{new Date(salary.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{salary.description}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-right font-medium">{formatCurrency(salary.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceDashboard;