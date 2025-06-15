import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  StyleSheet,
  pdf,
  Font,
  Page,
  Text,
  View,
  Document,
  Image,
} from "@react-pdf/renderer";
import Adminnavbar from "./Component/Adminnavbar";

export function MachinePdf() {
  const [machine, setMachine] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await axios.get(
        "http://localhost:3000/api/machines/getallmachines"
      );
      setMachine(data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generatePDF = () => {
    // Register fonts for better typography
    Font.register({
      family: "Roboto",
      fonts: [
        { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf", fontWeight: 'normal' },
        { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 'bold' },
      ]
    });

    const styles = StyleSheet.create({
      page: {
        padding: 40,
        fontFamily: 'Roboto',
      },
      header: {
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#4CAF50',
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      headerContent: {
        flex: 1,
      },
      logo: {
        width: 60,
        height: 60,
        marginLeft: 15,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 5,
      },
      subtitle: {
        fontSize: 12,
        color: '#616161',
        marginBottom: 10,
      },
      dateText: {
        fontSize: 10,
        color: '#757575',
      },
      section: {
        marginBottom: 15,
      },
      table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#4CAF50',
        marginTop: 10,
      },
      tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
      },
      tableRowEven: {
        backgroundColor: '#F1F8E9',
      },
      tableHeader: {
        backgroundColor: '#4CAF50',
      },
      tableHeaderCell: {
        padding: 8,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: '#388E3C',
      },
      tableCell: {
        padding: 8,
        fontSize: 10,
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: '#E0E0E0',
        textAlign: 'center',
      },
      lastCell: {
        borderRightWidth: 0,
      },
      footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 8,
        color: '#9E9E9E',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingTop: 5,
      },
      summary: {
        marginTop: 20,
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#F1F8E9',
        borderRadius: 5,
      },
      summaryText: {
        fontSize: 10,
        color: '#424242',
      },
      pageNumber: {
        position: 'absolute',
        bottom: 30,
        right: 40,
        fontSize: 8,
        color: '#9E9E9E',
      },
    });

    const formatDate = () => {
      const today = new Date();
      return today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    // Import logo image path
    const logoPath = require('./logo.png');

    const MyDocument = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Machine Inventory Report</Text>
              <Text style={styles.subtitle}>Complete list of all registered machines and their specifications</Text>
              <Text style={styles.dateText}>Generated on: {formatDate()}</Text>
            </View>
            <Image style={styles.logo} src={logoPath} />
          </View>
          
          <View style={styles.section}>
            <Text style={{ fontSize: 12, marginBottom: 5, fontWeight: 'bold' }}>
              Total Machines: {machine.length}
            </Text>
          </View>

          <View style={styles.table}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableHeaderCell}>Machine Name</Text>
              <Text style={styles.tableHeaderCell}>Cost</Text>
              <Text style={styles.tableHeaderCell}>Parts</Text>
              <Text style={[styles.tableHeaderCell, styles.lastCell]}>Description</Text>
            </View>
            
            {/* Table Data */}
            {machine.map((machine, index) => (
              <View 
                key={index} 
                style={[
                  styles.tableRow, 
                  index % 2 === 1 ? styles.tableRowEven : {}
                ]}
              >
                <Text style={styles.tableCell}>{machine.name}</Text>
                <Text style={styles.tableCell}>{machine.cost.join(", ")}</Text>
                <Text style={styles.tableCell}>{machine.parts.join(", ")}</Text>
                <Text style={[styles.tableCell, styles.lastCell]}>{machine.discription}</Text>
              </View>
            ))}
          </View>

          {machine.length > 0 && (
            <View style={styles.summary}>
              <Text style={[styles.summaryText, { fontWeight: 'bold' }]}>
                Summary:
              </Text>
              <Text style={styles.summaryText}>
                This document contains a comprehensive list of all machines in the inventory. 
                Please refer to the maintenance schedule for service information.
              </Text>
            </View>
          )}

          <Text style={styles.footer}>
            © {new Date().getFullYear()} GreenGrow - Machine Inventory System - CONFIDENTIAL
          </Text>
          
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
            fixed
          />
        </Page>
      </Document>
    );

    pdf(MyDocument)
      .toBlob()
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Machine_Inventory_Report.pdf");
        document.body.appendChild(link);
        link.click();
      });
  };

  const toggleNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  return (
    <div className="bg-green-50 min-h-screen">
      <div className="flex">
        {/* Side Navigation - Hidden by default */}
        {showNavbar && <Adminnavbar />}

        {/* Main Table Section */}
        <div className="flex flex-col flex-1 p-4">
          {/* Toggle Navbar Button */}
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={toggleNavbar}
              className="text-green-600 hover:text-green-800 focus:outline-none"
            >
              {showNavbar ? "Hide Menu" : "Show Menu"}
            </button>
            <div className="text-green-800 font-bold text-lg">GreenGrow Machine Inventory</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-800 border border-green-200 shadow-lg rounded-md overflow-hidden">
              <thead className="text-xs text-white uppercase bg-green-600">
                <tr>
                  <th className="px-6 py-4 text-center">Name</th>
                  <th className="px-6 py-4 text-center">Cost of the Machine</th>
                  <th className="px-6 py-4 text-center">Machine Parts</th>
                  <th className="px-6 py-4 text-center">Machine Details</th>
                </tr>
              </thead>
              <tbody>
                {machine.length > 0 ? (
                  machine.map((machine, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white hover:bg-green-200 transition" : "bg-green-100 hover:bg-green-200 transition"}
                    >
                      <td className="px-6 py-4 text-center font-medium">{machine.name}</td>
                      <td className="px-6 py-4 text-center">{machine.cost.join(", ")}</td>
                      <td className="px-6 py-4 text-center">{machine.parts.join(", ")}</td>
                      <td className="px-6 py-4 text-center">{machine.discription}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-red-500 font-semibold">
                      Machines not found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Generate PDF Button */}
          <div className="flex justify-end mt-8">
            <button
              onClick={generatePDF}
              className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-semibold rounded-full px-8 py-3 text-sm transition-all shadow-md"
            >
              Generate PDF
            </button>
          </div>
          
          {/* Footer */}
          <div className="text-center text-gray-500 text-xs mt-8">
            © 2025 GreenGrow
          </div>
        </div>
      </div>
    </div>
  );
}