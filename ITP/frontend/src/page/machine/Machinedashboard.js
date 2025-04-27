import React, { useEffect, useState } from "react";
import Adminnavbar from "./Component/Adminnavbar";
import axios from "axios";
import { FaShuttleVan, FaSpinner } from "react-icons/fa";
import { GiCaravan, GiAutoRepair } from "react-icons/gi";
import { calculateNextRepairDate } from "./Machine";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Machinedashboard() {
  const [loading, setLoading] = useState(true);
  const [filteredMachines, setFilteredMachines] = useState([]);
  const [machineCountsByLocation, setMachineCountsByLocation] = useState({});
  const [totalMachines, setTotalMachines] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/machines/getallmachines");
        const machines = response.data;
        
        setTotalMachines(machines.length);
        
        const machinesNeedingRepair = machines.filter((machine) => {
          const { remainingDays } = calculateNextRepairDate(
            machine.lastRepairDate,
            machine.repairTimePeriod
          );
          return remainingDays <= 7;
        });

        setFilteredMachines(machinesNeedingRepair);

        // Calculate machine counts by location
        const countsByLocation = {};
        machinesNeedingRepair.forEach((machine) => {
          const location = machine.location;
          countsByLocation[location] = (countsByLocation[location] || 0) + 1;
        });
        setMachineCountsByLocation(countsByLocation);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare data for the bar chart
  const locations = Object.keys(machineCountsByLocation);
  const machineCounts = Object.values(machineCountsByLocation);

  const chartData = {
    labels: locations,
    datasets: [
      {
        label: "Machines Requiring Repair",
        backgroundColor: "rgba(53, 162, 235, 0.8)",
        borderColor: "rgba(53, 162, 235, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(53, 162, 235, 0.9)",
        hoverBorderColor: "rgba(53, 162, 235, 1)",
        data: machineCounts,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Machines Requiring Repair by Location',
        font: {
          size: 18
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `${context.parsed.y} machines need repair`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        title: {
          display: true,
          text: 'Number of Machines',
          font: {
            size: 14
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        title: {
          display: true,
          text: 'Location',
          font: {
            size: 14
          }
        }
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar navigation - will be provided by layout */}
      <div className="w-64 flex-shrink-0">
        <Adminnavbar />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Machine Dashboard</h1>
            <p className="text-gray-600 mt-1">Overview of machine status and pending repairs</p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <FaSpinner className="animate-spin text-blue-500 w-10 h-10" />
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                <div className="bg-white rounded-lg shadow p-5 border-l-4 border-red-500">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-red-100 mr-4">
                      <GiAutoRepair className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pending Repairs</p>
                      <p className="text-2xl font-bold text-gray-800">{filteredMachines.length}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link to="/repairs" className="text-sm text-red-500 hover:text-red-600 font-medium">View repair schedule →</Link>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-5 border-l-4 border-blue-500">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 mr-4">
                      <GiCaravan className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Machines</p>
                      <p className="text-2xl font-bold text-gray-800">{totalMachines}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link to="/machines" className="text-sm text-blue-500 hover:text-blue-600 font-medium">Manage machines →</Link>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 mr-4">
                      <FaShuttleVan className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Vehicles</p>
                      <p className="text-2xl font-bold text-gray-800">60</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link to="/vehicles" className="text-sm text-green-500 hover:text-green-600 font-medium">Manage vehicles →</Link>
                  </div>
                </div>
              </div>

              {/* Chart Section */}
              <div className="bg-white p-5 rounded-lg shadow mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Repair Status by Location</h2>
                
                {locations.length > 0 ? (
                  <div className="h-64">
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No repair data available by location</p>
                  </div>
                )}
              </div>

              {/* Recent Machines Table */}
              {filteredMachines.length > 0 && (
                <div className="bg-white p-5 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Machines Requiring Immediate Attention</h2>
                    <Link to="/repairs" className="text-sm text-blue-500 hover:text-blue-600 font-medium">View all</Link>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine ID</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Repair</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Remaining</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredMachines.slice(0, 5).map((machine) => {
                          const { remainingDays } = calculateNextRepairDate(
                            machine.lastRepairDate,
                            machine.repairTimePeriod
                          );
                          
                          return (
                            <tr key={machine._id}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{machine.machineId || machine._id}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{machine.location}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {new Date(machine.lastRepairDate).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  remainingDays <= 0 
                                    ? 'bg-red-100 text-red-800' 
                                    : remainingDays <= 3 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {remainingDays <= 0 ? 'Overdue' : `${remainingDays} days`}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                <Link to={`/repair/${machine._id}`} className="text-blue-600 hover:text-blue-900">Schedule Repair</Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Machinedashboard;