import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';
import UpdateFinanceForm from '../UpdateFinanceForm';

const FinanceList = ({ data, refresh }) => {
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedData, setSelectedData] = useState(null); // This will hold the selected entry data

  const deleteEntry = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axios.delete(`http://localhost:3000/api/financial/${id}`);
        toast.success('Finance entry deleted successfully');
        
        // Refresh data after successful delete
        if (typeof refresh === 'function') {
          refresh();
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error('Failed to delete finance entry');
      }
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '';
    return `Rs. ${amount.toLocaleString('en-IN')}`;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const today = new Date();
    const generatedDate = today.toLocaleString();
    let y = 10;

    doc.setFontSize(16);
    doc.text('Finance Report', 14, y);
    y += 6;

    doc.setFontSize(10);
    doc.text(`Generated on: ${generatedDate}`, 14, y);
    y += 10;

    const formatEntries = (entries) =>
      entries.map((e) => [
        new Date(e.date).toLocaleDateString(),
        e.category || '',
        e.description || '',
        `Rs. ${e.amount ? e.amount.toFixed(2) : '0.00'}`,
      ]);

    const incomeEntries = data.filter((e) => e.type === 'income');
    const expenseEntries = data.filter((e) => e.type === 'expense');

    const groupByCategory = (entries, cat) =>
      entries.filter((e) => {
        if (cat === 'others') {
          return !['salary', 'order', 'petty-cash'].includes((e.category || '').toLowerCase());
        }
        return (e.category || '').toLowerCase() === cat;
      });

    doc.setFontSize(12);
    doc.text('INCOME', 14, y);
    y += 4;

    ['order', 'others'].forEach((cat) => {
      const entries = groupByCategory(incomeEntries, cat);
      if (entries.length > 0) {
        doc.setFontSize(11);
        doc.text(`${cat.charAt(0).toUpperCase() + cat.slice(1)}`, 14, y);
        y += 2;
        autoTable(doc, {
          startY: y,
          head: [['Date', 'Category', 'Description', 'Amount']],
          body: formatEntries(entries),
          theme: 'grid',
          headStyles: { fillColor: [46, 204, 113] },
        });
        y = doc.lastAutoTable.finalY + 6;
      }
    });

    doc.setFontSize(12);
    doc.text('EXPENSES', 14, y);
    y += 4;

    ['salary', 'order', 'petty-cash', 'others'].forEach((cat) => {
      const entries = groupByCategory(expenseEntries, cat);
      if (entries.length > 0) {
        doc.setFontSize(11);
        doc.text(`${cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}`, 14, y);
        y += 2;
        autoTable(doc, {
          startY: y,
          head: [['Date', 'Category', 'Description', 'Amount']],
          body: formatEntries(entries),
          theme: 'grid',
          headStyles: { fillColor: [231, 76, 60] },
        });
        y = doc.lastAutoTable.finalY + 6;
      }
    });

    const totalIncome = incomeEntries.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalExpense = expenseEntries.reduce((sum, e) => sum + (e.amount || 0), 0);
    const balance = totalIncome - totalExpense;

    doc.setFontSize(12);
    doc.text('SUMMARY', 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [['Total Income', 'Total Expense', 'Balance']],
      body: [[
        `Rs. ${totalIncome.toFixed(2)}`,
        `Rs. ${totalExpense.toFixed(2)}`,
        `Rs. ${balance.toFixed(2)}`
      ]],
      theme: 'grid',
      headStyles: { fillColor: [52, 152, 219] },
      styles: { fontStyle: 'bold' },
    });

    doc.save(`Finance_Report_${today.toLocaleDateString().replaceAll('/', '-')}.pdf`);
    toast.success('PDF report generated successfully');
  };

  const toggleExpandRow = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getCategoryBadge = (category) => {
    if (!category) return 'bg-gray-100 text-gray-800';
    
    const categories = {
      'salary': 'bg-purple-100 text-purple-800',
      'order': 'bg-blue-100 text-blue-800',
      'petty-cash': 'bg-yellow-100 text-yellow-800'
    };
    
    return categories[category.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getTypeStyles = (type) => {
    return type === 'income' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const handleEditClick = (id) => {
    const selected = data.find((item) => item._id === id);
    setSelectedData(selected); // Set the selected data for editing
    setEditingId(id); // Trigger the update form
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Financial Transactions</h2>
        <button
          onClick={generatePDF}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Download PDF Report
        </button>
      </div>

      {/* Edit form section */}
      {editingId && selectedData && (
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md border border-green-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Transaction
              </h3>
              <button 
                onClick={() => setEditingId(null)} // Close the edit form
                className="text-white hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <UpdateFinanceForm
                id={editingId}
                formData={selectedData} // Pass the selected data to the form
                onClose={() => setEditingId(null)}
                onUpdate={() => {
                  if (typeof refresh === 'function') {
                    refresh();
                  }
                  setEditingId(null);
                  setSelectedData(null); // Reset selected data after update
                }}
              />
            </div>
          </div>
        </div>
      )}

      {data.length === 0 ? (
        <div className="flex justify-center items-center py-12 bg-gray-50 rounded-md border border-gray-200">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 font-medium">No finance entries found</p>
            <p className="text-gray-500 text-sm mt-1">Add new entries to view them here</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 font-semibold text-gray-600 rounded-tl-md">Date</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Type</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Category</th>
                <th className="hidden md:table-cell px-4 py-3 font-semibold text-gray-600">Description</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Amount</th>
                <th className="px-4 py-3 font-semibold text-gray-600 rounded-tr-md">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, index) => (
                <React.Fragment key={entry._id}>
                  <tr className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                    <td className="px-4 py-3 border-t border-gray-200">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 border-t border-gray-200">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeStyles(entry.type)}`}>
                        {entry.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-t border-gray-200">
                      {entry.category ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadge(entry.category)}`}>
                          {entry.category}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">None</span>
                      )}
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 border-t border-gray-200 max-w-xs truncate">
                      {entry.description || <span className="text-gray-400 text-xs">No description</span>}
                    </td>
                    <td className={`px-4 py-3 border-t border-gray-200 font-medium ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(entry.amount)}
                    </td>
                    <td className="px-4 py-3 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(entry._id)} // Open the edit form with the selected data
                          className="bg-green-100 text-green-700 p-1.5 rounded hover:bg-green-200 transition-colors"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteEntry(entry._id)}
                          className="bg-red-100 text-red-700 p-1.5 rounded hover:bg-red-200 transition-colors"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        <button
                          onClick={() => toggleExpandRow(entry._id)}
                          className="md:hidden bg-gray-100 text-gray-700 p-1.5 rounded hover:bg-gray-200 transition-colors"
                          title="View details"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Mobile view expanded row */}
                  {expandedId === entry._id && (
                    <tr className="md:hidden bg-blue-50">
                      <td colSpan={6} className="px-4 py-3 border-t border-blue-100">
                        <div className="text-sm text-gray-700">
                          <p className="font-medium">Description:</p>
                          <p className="mb-2">{entry.description || <span className="text-gray-400 text-xs italic">No description provided</span>}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FinanceList;
