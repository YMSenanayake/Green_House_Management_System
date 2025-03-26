import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "chart.js/auto"; // Import Chart.js library
import Adminnavbar from "./component/Adminnavbar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Loader from "../../components/header/Loader";
import AOS from "aos";
import "aos/dist/aos.css";
import { Tag } from "antd";

AOS.init({
  duration: 2500,
});

function Employeedashboard() {
  const [users, setUsers] = useState([]);
  const [roleCounts, setRoleCounts] = useState({});
  const [data, setData] = useState(null);
  const [approveleaves, setapproveleaves] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/api/leaves/statuscounts")
      .then((response) => {
        setStatusCounts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching status counts:", error);
        setLoading(false);
      });
  }, []);

  //get all leaves
  const allleaves = async () => {
    try {
      setLoading(true);
      const data = await axios.get(
        "http://localhost:3000/api/leaves/getallleaves"
      );
      setapproveleaves(data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    allleaves();
  }, []);

  const [state, setState] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      },
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
    ],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/users/getallusers"
      );
      setUsers(response.data);
      setLoading(false);
      // Calculate role counts
      const counts = response.data.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});
      setRoleCounts(counts);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Enhanced color palette with more professional colors
  const ROLE_COLORS = {
    employee: "#14532d",
    courier: "#365314",
    user: "#65a30d",
    target: "#a3e635",
    financial: "#fcd34d",
    inventory: "#48c81b",
    machine: "#22c55e",
    tunnel: "#15803d"
  };

  useEffect(() => {
    if (roleCounts && Object.keys(roleCounts).length > 0) {
      setData({
        labels: Object.keys(roleCounts),
        datasets: [
          {
            data: Object.values(roleCounts),
            backgroundColor: Object.keys(roleCounts).map(role => ROLE_COLORS[role] || "#000"),
          },
        ],
      });
    }
  }, [roleCounts]);

  return (
    <div className="min-h-screen bg-gray-100">
      {loading ? (
        <Loader />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex">
            <Adminnavbar />
            <div className="flex-grow ml-64 space-y-8">
              {/* Employee Leaves Summary Card */}
              <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-green-500">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                  Employee Leaves Summary
                </h1>
                
                <div className="grid grid-cols-3 gap-6">
                  {/* Pending Leaves */}
                  <div 
                    data-aos="zoom-in" 
                    className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out"
                  >
                    <h2 className="text-lg font-semibold text-center text-gray-700 mb-4">
                      Pending ({statusCounts.pending?.count})
                    </h2>
                    <div className="flex justify-center">
                      <div style={{ width: 150, height: 150 }}>
                        <CircularProgressbar
                          value={statusCounts.pending?.percentage}
                          text={`${statusCounts.pending?.percentage}%`}
                          styles={buildStyles({
                            pathColor: "#48c81b",
                            textColor: "#48c81b",
                            trailColor: "#e6e6e6",
                          })}
                          className="transform transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Approved Leaves */}
                  <div 
                    data-aos="zoom-in" 
                    className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out"
                  >
                    <h2 className="text-lg font-semibold text-center text-gray-700 mb-4">
                      Approved ({statusCounts.approved?.count})
                    </h2>
                    <div className="flex justify-center">
                      <div style={{ width: 150, height: 150 }}>
                        <CircularProgressbar
                          value={statusCounts.approved?.percentage}
                          text={`${statusCounts.approved?.percentage}%`}
                          styles={buildStyles({
                            pathColor: "#48c81b",
                            textColor: "#48c81b",
                            trailColor: "#e6e6e6",
                          })}
                          className="transform transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Disapproved Leaves */}
                  <div 
                    data-aos="zoom-in" 
                    className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out"
                  >
                    <h2 className="text-lg font-semibold text-center text-gray-700 mb-4">
                      Disapproved ({statusCounts.disapproved?.count})
                    </h2>
                    <div className="flex justify-center">
                      <div style={{ width: 150, height: 150 }}>
                        <CircularProgressbar
                          value={statusCounts.disapproved?.percentage}
                          text={`${statusCounts.disapproved?.percentage}%`}
                          styles={buildStyles({
                            pathColor: "#48c81b",
                            textColor: "#48c81b",
                            trailColor: "#e6e6e6",
                          })}
                          className="transform transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Count Summary Card */}
              <div 
                data-aos="zoom-out" 
                className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500"
              >
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                  User Role Distribution
                </h2>
                
                <div className="grid grid-cols-2 gap-6">
                  {/* Pie Chart */}
                  <div className="flex justify-center items-center">
                    {data && (
                      <div className="w-full max-w-xs">
                        <Pie 
                          data={data} 
                          options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                              legend: {
                                position: 'bottom',
                                labels: {
                                  boxWidth: 20,
                                  usePointStyle: true,
                                }
                              }
                            }
                          }} 
                        />
                      </div>
                    )}
                  </div>

                  {/* Role Counts with Progress Bars */}
                  <div className="space-y-4">
                    {Object.entries(roleCounts).map(([role, count]) => {
                      // Calculate percentage of total users
                      const totalUsers = Object.values(roleCounts).reduce((a, b) => a + b, 0);
                      const percentage = ((count / totalUsers) * 100).toFixed(1);

                      return (
                        <div 
                          key={role} 
                          className="bg-gray-50 p-4 rounded-lg shadow-md"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-gray-700 capitalize">{role}</span>
                            <span className="text-green-600 font-bold">{count}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="h-2.5 rounded-full" 
                              style={{
                                width: `${percentage}%`, 
                                backgroundColor: ROLE_COLORS[role] || "#000"
                              }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 text-right">
                            {percentage}% of total users
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employeedashboard;