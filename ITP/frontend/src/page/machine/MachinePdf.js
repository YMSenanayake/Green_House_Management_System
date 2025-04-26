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
      },
      section: {
        marginBottom: 10,
      },
      table: {
        display: "table",
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#000",
        marginBottom: 10,
      },
      tableRow: {
        flexDirection: "row",
      },
      tableCell: {
        flex: 1,
        padding: 5,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#000",
      },
      tableHeader: {
        backgroundColor: "#f0f0f0",
      },
    });

    const MyDocument = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>Machine List</Text>
          </View>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Name</Text>
              <Text style={styles.tableCell}>Cost of the Machine</Text>
              <Text style={styles.tableCell}>Machine Parts</Text>
              <Text style={styles.tableCell}>Machine Description</Text>
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
    <div className="bg-white min-h-screen">
      <div className="flex">
        {/* Side Navigation */}
        <Adminnavbar />

        {/* Main Table Section */}
        <div className="flex flex-col flex-1 p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300 border border-gray-300 shadow-lg">
              <thead className="text-xs text-white uppercase bg-green-600 dark:bg-green-800">
                <tr>
                  <th className="px-6 py-3 text-center">Name</th>
                  <th className="px-6 py-3 text-center">Cost of the Machine</th>
                  <th className="px-6 py-3 text-center">Machine Parts</th>
                  <th className="px-6 py-3 text-center">Machine Details</th>
                </tr>
              </thead>
              <tbody>
                {machine.length > 0 ? (
                  machine.map((machine, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4 text-center">{machine.name}</td>
                      <td className="px-6 py-4 text-center">{machine.cost.join(", ")}</td>
                      <td className="px-6 py-4 text-center">{machine.parts.join(", ")}</td>
                      <td className="px-6 py-4 text-center">{machine.discription}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-red-500">
                      Machines not found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Generate PDF Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={generatePDF}
              className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-400 font-medium rounded-full px-6 py-2.5 text-sm transition shadow-md"
            >
              Generate PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
