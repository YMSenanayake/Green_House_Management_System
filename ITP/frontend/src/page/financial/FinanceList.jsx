import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import FinanceList from './components/FinanceList';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FinancePage = () => {
  const pdfRef = useRef();
  const [financeData, setFinanceData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.get(`http://localhost:3000/api/financial`, {
        params: { search },
        timeout: 10000 // 10 second timeout
      });
      setFinanceData(res.data);
      toast.success('Data loaded successfully');
    } catch (err) {
      console.error("Error fetching finance data:", err);
      
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please check your server or try again.');
        toast.error('Request timed out');
      } else if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Server error: ${err.response.status} ${err.response.statusText}`);
        toast.error(`Server error: ${err.response.status}`);
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Make sure your backend is running at http://localhost:3000');
        toast.error('No response from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${err.message}`);
        toast.error(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 500); // Debounce the search
    
    return () => clearTimeout(timer);
  }, [search, fetchData]);

  const filteredData = financeData.filter(entry => {
    try {
      const matchesSearch = entry.category?.toLowerCase().includes(search.toLowerCase()) ||
                          entry.description?.toLowerCase().includes(search.toLowerCase());

      if (!entry.date) return matchesSearch;
      
      const entryDate = new Date(entry.date);
      // Check if the date is valid
      if (isNaN(entryDate.getTime())) return matchesSearch;
      
      const matchesMonth = selectedMonth ? (entryDate.getMonth() + 1).toString().padStart(2, '0') === selectedMonth : true;
      const matchesYear = selectedYear ? entryDate.getFullYear().toString() === selectedYear : true;

      return matchesSearch && matchesMonth && matchesYear;
    } catch (err) {
      console.error("Error filtering entry:", err, entry);
      return false;
    }
  });

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex pt-24">
        <Sidebar />
        <main className="flex-1 ml-64 px-6 py-6" ref={pdfRef}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Finance Management</h1>
          </div>
          
          <SearchBar
            value={search}
            onChange={setSearch}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
          
          {loading && <div className="text-center py-4">Loading...</div>}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
              <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-2"
                onClick={() => fetchData()}
              >
                Retry
              </button>
            </div>
          )}
          
          {!loading && !error && (
            <div className="mt-8">
              {filteredData.length > 0 ? (
                <FinanceList 
                  data={filteredData} 
                  refresh={fetchData} 
                />
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  No matching finance entries found.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default FinancePage;