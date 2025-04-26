import React, { useState, useEffect } from "react";
import axios from "axios";
import Adminnavbar from "./component/Adminnavbar";

function Employeeattendance() {
  const [attendanceIn, setAttendanceIn] = useState([]);
  const [attendanceOut, setAttendanceOut] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersMap, setUsersMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchDataIn();
    fetchDataOut();
  }, []);

  const fetchDataIn = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/attendanceIn/getalllmarkIn"
      );
      const usersData = await axios.get("http://localhost:3000/api/users/getallusers");

      const users = usersData.data.reduce((acc, user) => {
        acc[user._id] = user.fullName;
        return acc;
      }, {});
      setUsersMap(users);
      setAttendanceIn(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchDataOut = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/attendanceOut/getalllmarkOut"
      );
      setAttendanceOut(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const calculateTimeDifference = (startTime, endTime) => {
    const start = new Date(`01/01/2020 ${startTime}`);
    const end = new Date(`01/01/2020 ${endTime}`);
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Filter attendance data based on search term
  const filteredAttendance = attendanceIn.filter(item => 
    usersMap[item.userid]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.date?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAttendance.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50">
      <Adminnavbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-green-800">Employee Attendance Dashboard</h1>
          </div>
          
          {/* Search and Filter */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search by name or date..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-green-800 text-white">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Employee Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Check In
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Check Out
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Work Hours
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.length > 0 ? (
                      currentItems.map((attendanceInItem, index) => {
                        const correspondingOutTime = attendanceOut[index]
                          ? attendanceOut[index].outtime
                          : "";

                        const workHours =
                          correspondingOutTime &&
                          attendanceInItem.intime &&
                          calculateTimeDifference(
                            attendanceInItem.intime,
                            correspondingOutTime
                          );

                        return (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors duration-200"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{usersMap[attendanceInItem.userid] || "Unknown"}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                              {attendanceInItem.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {attendanceInItem.intime}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {correspondingOutTime ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  {correspondingOutTime}
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                  Not checked out
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">
                              {workHours ? (
                                <span className="text-gray-900">{workHours}</span>
                              ) : (
                                <span className="text-gray-400">--</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          No attendance records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredAttendance.length > itemsPerPage && (
                <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                        <span className="font-medium">
                          {Math.min(indexOfLastItem, filteredAttendance.length)}
                        </span>{" "}
                        of <span className="font-medium">{filteredAttendance.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => paginate(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === 1 ? "text-gray-300" : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={i}
                              onClick={() => paginate(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNum
                                  ? "z-10 bg-green-50 border-green-500 text-green-600"
                                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === totalPages ? "text-gray-300" : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
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

export default Employeeattendance;