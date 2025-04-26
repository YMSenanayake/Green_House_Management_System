import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// Professional color palette
const INCOME_COLORS = [
  'rgba(16, 185, 129, 0.8)',  // Green
  'rgba(14, 165, 233, 0.8)',  // Blue
  'rgba(139, 92, 246, 0.8)',  // Purple
  'rgba(249, 115, 22, 0.8)',  // Orange
  'rgba(234, 179, 8, 0.8)'    // Yellow
];

const EXPENSE_COLORS = [
  'rgba(239, 68, 68, 0.8)',   // Red
  'rgba(249, 115, 22, 0.8)',  // Orange
  'rgba(234, 179, 8, 0.8)',   // Yellow
  'rgba(168, 85, 247, 0.8)',  // Purple
  'rgba(236, 72, 153, 0.8)'   // Pink
];

const COUNT_COLORS = {
  income: 'rgba(16, 185, 129, 0.2)',
  expense: 'rgba(239, 68, 68, 0.2)',
  incomeBorder: 'rgba(16, 185, 129, 1)',
  expenseBorder: 'rgba(239, 68, 68, 1)'
};

const FinanceDashboard = ({ data }) => {
  const [totals, setTotals] = useState({ income: 0, expense: 0 });
  const [pieChartData, setPieChartData] = useState({ 
    income: { labels: [], datasets: [] },
    expense: { labels: [], datasets: [] }
  });
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    if (data && data.length > 0) {
      prepareChartData(data);
    }
  }, [data]);

  const prepareChartData = (data) => {
    // Group by category and type
    const incomeByCategory = {};
    const expenseByCategory = {};
    let totalIncome = 0;
    let totalExpense = 0;

    // Process data
    data.forEach(entry => {
      const category = entry.category || 'Uncategorized';
      
      if (entry.type === 'income') {
        totalIncome += entry.amount || 0;
        incomeByCategory[category] = (incomeByCategory[category] || 0) + (entry.amount || 0);
      } else if (entry.type === 'expense') {
        totalExpense += entry.amount || 0;
        expenseByCategory[category] = (expenseByCategory[category] || 0) + (entry.amount || 0);
      }
    });

    setTotals({ income: totalIncome, expense: totalExpense });

    // Prepare pie chart data
    const incomePieData = {
      labels: Object.keys(incomeByCategory).map(category => 
        category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')
      ),
      datasets: [
        {
          data: Object.values(incomeByCategory),
          backgroundColor: INCOME_COLORS,
          borderColor: INCOME_COLORS.map(color => color.replace('0.8', '1')),
          borderWidth: 1
        }
      ]
    };

    const expensePieData = {
      labels: Object.keys(expenseByCategory).map(category => 
        category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')
      ),
      datasets: [
        {
          data: Object.values(expenseByCategory),
          backgroundColor: EXPENSE_COLORS,
          borderColor: EXPENSE_COLORS.map(color => color.replace('0.8', '1')),
          borderWidth: 1
        }
      ]
    };

    // Count entries by category
    const incomeCategoryCounts = {};
    const expenseCategoryCounts = {};

    data.forEach(entry => {
      const category = entry.category || 'Uncategorized';
      
      if (entry.type === 'income') {
        incomeCategoryCounts[category] = (incomeCategoryCounts[category] || 0) + 1;
      } else if (entry.type === 'expense') {
        expenseCategoryCounts[category] = (expenseCategoryCounts[category] || 0) + 1;
      }
    });

    // Prepare bar chart data
    const allCategories = [...new Set([
      ...Object.keys(incomeCategoryCounts),
      ...Object.keys(expenseCategoryCounts)
    ])].map(category => 
      category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')
    );

    const barData = {
      labels: allCategories,
      datasets: [
        {
          label: 'Income Entries',
          data: allCategories.map(category => {
            const originalCategory = category.charAt(0).toLowerCase() + category.slice(1).replace(' ', '-');
            return incomeCategoryCounts[originalCategory] || 0;
          }),
          backgroundColor: COUNT_COLORS.income,
          borderColor: COUNT_COLORS.incomeBorder,
          borderWidth: 1
        },
        {
          label: 'Expense Entries',
          data: allCategories.map(category => {
            const originalCategory = category.charAt(0).toLowerCase() + category.slice(1).replace(' ', '-');
            return expenseCategoryCounts[originalCategory] || 0;
          }),
          backgroundColor: COUNT_COLORS.expense,
          borderColor: COUNT_COLORS.expenseBorder,
          borderWidth: 1
        }
      ]
    };

    setPieChartData({ income: incomePieData, expense: expensePieData });
    setBarChartData(barData);
  };

  const formatCurrency = (value) => {
    return `Rs. ${value.toLocaleString('en-IN')}`;
  };

  // Chart options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Number of Entries by Category',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  // Calculate balance
  const balance = totals.income - totals.expense;
  const balanceStatus = balance >= 0 ? 'positive' : 'negative';

  return (
    <div className="my-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Financial Dashboard</h2>
          <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Total Entries:</span> {data?.length || 0}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-green-100 transition-all hover:shadow-lg">
          <div className="bg-green-50 p-3 flex justify-between items-center">
            <h3 className="text-green-800 font-semibold">Total Income</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="p-6">
            <p className="text-3xl font-bold text-green-600">{formatCurrency(totals.income)}</p>
            <p className="text-xs text-gray-500 mt-2">
              {pieChartData.income.labels.length} income {pieChartData.income.labels.length === 1 ? 'category' : 'categories'}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-red-100 transition-all hover:shadow-lg">
          <div className="bg-red-50 p-3 flex justify-between items-center">
            <h3 className="text-red-800 font-semibold">Total Expense</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="p-6">
            <p className="text-3xl font-bold text-red-600">{formatCurrency(totals.expense)}</p>
            <p className="text-xs text-gray-500 mt-2">
              {pieChartData.expense.labels.length} expense {pieChartData.expense.labels.length === 1 ? 'category' : 'categories'}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-blue-100 transition-all hover:shadow-lg">
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
            <p className="text-xs text-gray-500 mt-2">
              {balanceStatus === 'positive' ? 'Surplus' : 'Deficit'} {totals.income > 0 ? 
                `(${Math.abs((balance / totals.income) * 100).toFixed(1)}% of income)` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Income Pie Chart */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-800">Income by Category</h3>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
              {pieChartData.income.labels.length} {pieChartData.income.labels.length === 1 ? 'category' : 'categories'}
            </span>
          </div>
          
          {pieChartData.income.datasets[0]?.data.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No income data to display</p>
              </div>
            </div>
          ) : (
            <div className="h-64">
              <Pie data={pieChartData.income} options={pieOptions} />
            </div>
          )}
        </div>

        {/* Expense Pie Chart */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-800">Expenses by Category</h3>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium">
              {pieChartData.expense.labels.length} {pieChartData.expense.labels.length === 1 ? 'category' : 'categories'}
            </span>
          </div>
          
          {pieChartData.expense.datasets[0]?.data.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No expense data to display</p>
              </div>
            </div>
          ) : (
            <div className="h-64">
              <Pie data={pieChartData.expense} options={pieOptions} />
            </div>
          )}
        </div>
      </div>

      {/* Bar Chart - Category Counts */}
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100 hover:shadow-lg transition-all mb-10">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-800">Transaction Count by Category</h3>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
            {barChartData.labels.length} {barChartData.labels.length === 1 ? 'category' : 'categories'}
          </span>
        </div>
        
        {barChartData.labels?.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-gray-500">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No categories to display</p>
            </div>
          </div>
        ) : (
          <div className="h-80">
            <Bar data={barChartData} options={barOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceDashboard;