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
} from "@react-pdf/renderer";
import Adminnavbar from "./Component/Adminnavbar";

export function MachinePdf() {
  const [machine, setMachine] = useState([]);
  const [loading, setLoading] = useState(false);

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
    Font.register({
      family: "Roboto",
      src: "https://cdnjs.cloudflare.com/ajax/libs/roboto/22.0.2/fonts/Roboto/roboto-regular.ttf",
    });

    const styles = StyleSheet.create({
      page: {
        padding: 30,
        fontFamily: "Roboto",
      },
      header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
        color: "#2e7d32",
        fontWeight: "bold",
      },
      section: {
        marginBottom: 15,
      },
      table: {
        display: "table",
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#8bc34a",
        marginBottom: 10,
      },
      tableRow: {
        flexDirection: "row",
      },
      tableCell: {
        flex: 1,
        padding: 8,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#c5e1a5",
        fontSize: 10,
      },
      tableHeader: {
        backgroundColor: "#8bc34a",
      },
      headerCell: {
        flex: 1,
        padding: 8,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#c5e1a5",
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 12,
      },
    });

    const MyDocument = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.header}>Machine List Report</Text>
          </View>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.headerCell}>Name</Text>
              <Text style={styles.headerCell}>Cost of the Machine</Text>
              <Text style={styles.headerCell}>Machine Parts</Text>
              <Text style={styles.headerCell}>Machine Description</Text>
            </View>
            {machine.map((machine, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{machine.name}</Text>
                <Text style={styles.tableCell}>{machine.cost.join(", ")}</Text>
                <Text style={styles.tableCell}>{machine.parts.join(", ")}</Text>
                <Text style={styles.tableCell}>{machine.discription}</Text>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    );

    pdf(MyDocument)
      .toBlob()
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "machines.pdf");
        document.body.appendChild(link);
        link.click();
      });
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 min-h-screen">
      <div className="flex">
        {/* Side Navigation */}
        <Adminnavbar />

        {/* Main Table Section */}
        <div className="flex flex-col flex-1 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-green-600">Machine Management</h1>
            <p className="text-gray-500">View and export machine information</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700 divide-y divide-gray-200">
                <thead className="bg-green-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-center font-medium">Name</th>
                    <th className="px-6 py-4 text-center font-medium">Cost of the Machine</th>
                    <th className="px-6 py-4 text-center font-medium">Machine Parts</th>
                    <th className="px-6 py-4 text-center font-medium">Machine Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {machine.length > 0 ? (
                    machine.map((machine, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-center">{machine.name}</td>
                        <td className="px-6 py-4 text-center">{machine.cost.join(", ")}</td>
                        <td className="px-6 py-4 text-center">{machine.parts.join(", ")}</td>
                        <td className="px-6 py-4 text-center">{machine.discription}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-gray-500">
                        {loading ? (
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                          </div>
                        ) : (
                          "No machines found."
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Generate PDF Button */}
          <div className="flex justify-end mt-8">
            <button
              onClick={generatePDF}
              className="inline-flex items-center text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg px-6 py-3 text-sm transition shadow-sm gap-2"
              disabled={loading || machine.length === 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}