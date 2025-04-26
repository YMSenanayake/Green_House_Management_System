import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import FinanceDashboard from './components/FinanceDashboard';
import FinanceList from './components/FinanceList';
import AddFinanceForm from './components/AddFinanceForm';

const FinancePage = () => {
  const pdfRef = useRef();
  const [financeData, setFinanceData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Create finance manager in localStorage
  useEffect(() => {
    if (!localStorage.getItem('currentUser')) {
      const financeManager = {
        _id: 'emp123456',
        name: 'Finance Manager',
        role: 'Finance Manager',
        salary: 85000,
        lastPaidDate: new Date().toISOString(),
        email: 'finance.manager@greenhouse.com',
        phone: '+94 75 123 4567'
      };
      localStorage.setItem('currentUser', JSON.stringify(financeManager));
      console.log('Finance Manager user created and stored in local storage');
    } else {
      console.log('User already exists in local storage');
    }
  }, []);

  // Fetch finance data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/financial?search=${search}`);
      if (Array.isArray(res.data)) {
        setFinanceData(res.data);
        setError(null);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (err) {
      console.error('Error fetching finance data:', err);
      setError('Failed to fetch data from server. Please check your connection.');
      toast.error('Error loading financial data');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [search]);

  // Export dashboard to PDF
  const exportToPDF = () => {
    const input = pdfRef.current;
    domtoimage.toPng(input)
      .then((dataUrl) => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (img.height * pdfWidth) / img.width;
          pdf.addImage(img, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save('finance-report.pdf');
          toast.success('PDF exported successfully');
        };
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
        toast.error('Failed to generate PDF');
      });
  };

  // Add new finance entry
  const handleAddFinance = async (formData) => {
    try {
      const res = await axios.post('http://localhost:3000/api/financial', formData);
      if (res.data) {
        toast.success('Finance entry added successfully');
        setShowAddForm(false);
        fetchData(); // Refresh data after adding
      }
    } catch (error) {
      console.error('Error adding finance entry:', error);
      toast.error('Failed to add finance entry');
    }
  };

  // Filter the data based on search, month, and year
  const filteredData = financeData.filter(entry => {
    const matchesSearch = entry.category?.toLowerCase().includes(search.toLowerCase()) ||
                         entry.description?.toLowerCase().includes(search.toLowerCase());

    const entryDate = new Date(entry.date);
    const matchesMonth = selectedMonth ? (entryDate.getMonth() + 1).toString().padStart(2, '0') === selectedMonth : true;
    const matchesYear = selectedYear ? entryDate.getFullYear().toString() === selectedYear : true;

    return matchesSearch && matchesMonth && matchesYear;
  });

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64 mt-20 container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-center mb-6">Finance Management</h1>
          
          
            <SearchBar
              value={search}
              onChange={setSearch}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
            

         

          <div ref={pdfRef}>
            <FinanceDashboard data={financeData} />
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">All Entries</h2>
              {loading ? (
                <div className="text-center py-6">Loading finance data...</div>
              ) : (
                <>
                  {error && <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">{error}</div>}
                  <FinanceList 
                    data={filteredData} 
                    refresh={fetchData} 
                  />
                </>
              )}
            </div>
          </div>

          <button
            onClick={exportToPDF}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            📊 Export Dashboard to PDF
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FinancePage;