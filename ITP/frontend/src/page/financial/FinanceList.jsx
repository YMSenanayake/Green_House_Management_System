import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import FinanceList from './components/FinanceList';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { useRef } from 'react';

const FinancePage = () => {
  const pdfRef = useRef();
  const [financeData, setFinanceData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

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
        };
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      });
  };

  const fetchData = async () => {
    const res = await axios.get(`http://localhost:5000/api/finance?search=${search}`);
    setFinanceData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const filteredData = financeData.filter(entry => {
    const matchesSearch = entry.category.toLowerCase().includes(search.toLowerCase()) ||
                          entry.description.toLowerCase().includes(search.toLowerCase());

    const entryDate = new Date(entry.date);
    const matchesMonth = selectedMonth ? (entryDate.getMonth() + 1).toString().padStart(2, '0') === selectedMonth : true;
    const matchesYear = selectedYear ? entryDate.getFullYear().toString() === selectedYear : true;

    return matchesSearch && matchesMonth && matchesYear;
  });

  return (
    <>
      <Header />
      <div className="flex pt-24">
        <Sidebar />
        <main className="flex-1 ml-64 px-6 py-6">
          <h1 className="text-2xl font-bold mb-6">Finance Management</h1>
          <SearchBar
            value={search}
            onChange={setSearch}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
          <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">All Entries</h2>
              <FinanceList data={filteredData} />
            </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default FinancePage;