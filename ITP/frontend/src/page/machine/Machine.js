import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit, FaPrint, FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import Swal from "sweetalert2";
import Adminnavbar from "./Component/Adminnavbar";
import Loader from "../../components/header/Loader";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Function to calculate next repair date and remaining days
export function calculateNextRepairDate(lastRepairDateStr, repairTimePeriod) {
  const lastDate = new Date(lastRepairDateStr);
  const currentDate = new Date();
  // Parse repairTimePeriod to ensure it's a number
  const repairPeriod = parseInt(repairTimePeriod);
  // Check if repairTimePeriod is a valid number
  if (isNaN(repairPeriod)) {
    console.error("Invalid repair time period:", repairTimePeriod);
    return {
      nextRepairDate: "Invalid Date",
      remainingDays: "NaN",
    };
  }
  const nextRepairDate = new Date(
    lastDate.getTime() + repairPeriod * 24 * 60 * 60 * 1000
  );
  const remainingDays = Math.ceil(
    (nextRepairDate - currentDate) / (1000 * 60 * 60 * 24)
  );
  return {
    nextRepairDate: nextRepairDate.toDateString(),
    remainingDays: remainingDays,
  };
}

export default function Machine() {
  const [machine, setmachine] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [duplicatmachines, setduplicatemachines] = useState([]);
  const [details, setDetails] = useState({});
  const [searchkey, setsearchkey] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("machines");
  
  const modalRef = useRef(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleDetails = (topic, machineId) => {
    setDetails((prevState) => ({
      ...prevState,
      [`${machineId}-${topic}`]: !prevState[`${machineId}-${topic}`],
    }));
  };

  //delete function
  const handleDelete = async (machineId, machineName) => {
    try {
      Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete ${machineName}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(
            `http://localhost:3000/api/machines/deletemachine/${machineId}`
          );
          // If deletion is successful, update the machines list
          setmachine(machine.filter((m) => m._id !== machineId));
          toast.success(`${machineName} has been deleted successfully`);
        }
      });
    } catch (error) {
      console.log("Error deleting machine:", error);
      toast.error("Failed to delete machine. Please try again.");
    }
  };

  //getting all machines
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await axios.get(
        "http://localhost:3000/api/machines/getallmachines"
      );
      setmachine(data.data);
      setduplicatemachines(data.data); // Update duplicateusers with fetched data
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch machines. Please check your connection.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
  }, []);

  //add new machine
  const [name, setname] = useState("");
  const [cost, setCost] = useState([""]);
  const [parts, setParts] = useState([""]);
  const [discription, setDiscript] = useState("");
  const [location, setLocation] = useState("poly_tunnel_01");
  const [lastRepairDate, setLastRepairDate] = useState(new Date());
  const [repairTimePeriod, setperiod] = useState("");
  const [remainingDays, setremain] = useState("");
  const [vehicalNO, setVehicalNO] = useState("");
  const [capacity, setCapacity] = useState("");

  const handleLocationChange = (value) => {
    setLocation(value);
    // Reset vehicle specific fields when location changes
    setVehicalNO("");
    setCapacity("");
  };

  const handleCostChange = (index, value) => {
    const newCost = [...cost];
    newCost[index] = value;
    setCost(newCost);
  };

  const handlePartsChange = (index, value) => {
    const newParts = [...parts];
    newParts[index] = value;
    setParts(newParts);
  };

  const addCostInput = () => {
    setCost([...cost, ""]);
  };

  const addPartsInput = () => {
    setParts([...parts, ""]);
  };

  const removeCostInput = (index) => {
    const newCost = cost.filter((_, i) => i !== index);
    setCost(newCost.length ? newCost : [""]); // Ensure at least one input remains
  };

  const removePartsInput = (index) => {
    const newParts = parts.filter((_, i) => i !== index);
    setParts(newParts.length ? newParts : [""]); // Ensure at least one input remains
  };

  async function addMachine(event) {
    event.preventDefault();

    const machine = {
      name,
      cost: cost.filter(item => item.trim() !== ""), // Filter out empty strings
      parts: parts.filter(item => item.trim() !== ""),
      discription,
      location,
      repairTimePeriod,
      lastRepairDate,
      remainingDays,
      vehicalNO: location === "Vehicle" ? vehicalNO : "",
      capacity: location === "Vehicle" ? capacity : "",
    };

    try {
      setLoading(true);
      const result = await axios.post(
        "http://localhost:3000/api/machines/add",
        machine
      );

      console.log(result.data);
      closeModal();
      Swal.fire({
        title: "Success!",
        text: "Machine added successfully",
        icon: "success",
        confirmButtonColor: "#10B981",
      }).then(() => {
        window.location.reload();
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to add machine. Please try again.");
      setLoading(false);
    }
  }

  function filterBySearch() {
    if (!searchkey.trim()) {
      setmachine(duplicatmachines);
      return;
    }
    
    const tempuser = duplicatmachines.filter((user) =>
      user.name.toLowerCase().includes(searchkey.toLowerCase())
    );

    setmachine(tempuser);

    // Check if the filtered array is empty
    if (tempuser.length === 0) {
      toast.error("No machines found with that name.");
    }
  }

  function filterByType(type) {
    if (type === "machines") {
      setmachine(duplicatmachines);
      return;
    }
    
    const filtered = duplicatmachines.filter((machine) =>
      machine.location === type
    );

    setmachine(filtered);
    
    // Check if the filtered array is empty
    if (filtered.length === 0) {
      toast.info(`No machines found in ${type} location.`);
    }
  }

  useEffect(() => {
    filterByType(selectedFilter);
  }, [selectedFilter, duplicatmachines]);

  const locations = [
    "poly_tunnel_01",
    "poly_tunnel_02",
    "poly_tunnel_03",
    "Inventory",
    "Vehicle",
  ];

  // Function to determine status color based on remaining days
  const getStatusColor = (remainingDays) => {
    if (remainingDays <= 7) return "bg-red-100 text-red-800"; // Critical - Red
    if (remainingDays <= 30) return "bg-yellow-100 text-yellow-800"; // Warning - Yellow
    return "bg-green-100 text-green-800"; // Good - Green
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <Loader />
      ) : (
        <div className="flex">
          {/* Side Navigation */}
          <Adminnavbar />

          {/* Main Content */}
          <div className="flex-1 pl-60">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-green-800" data-aos="fade-right">Machine Management</h1>
              <p className="text-gray-600 mt-2" data-aos="fade-right" data-aos-delay="100">
                Monitor and manage all machinery with maintenance schedules
              </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6" data-aos="fade-up">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Search by machine name..."
                  value={searchkey}
                  onChange={(e) => {
                    setsearchkey(e.target.value);
                    if (e.target.value === "") {
                      filterByType(selectedFilter);
                    }
                  }}
                  onKeyUp={filterBySearch}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <select
                    className="h-full py-0 pl-2 pr-7 text-gray-500 bg-transparent border-0 rounded-r-lg focus:ring-2 focus:ring-green-500"
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    value={selectedFilter}
                  >
                    <option value="machines">All Machines</option>
                    <option value="Inventory">Inventory</option>
                    <option value="Vehicle">Vehicles</option>
                    <option value="poly_tunnel_01">Tunnel 01</option>
                    <option value="poly_tunnel_02">Tunnel 02</option>
                    <option value="poly_tunnel_03">Tunnel 03</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <Link to="/m_MachinePdf">
                  <button
                    className="flex items-center gap-2 px-4 py-2 font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:outline-none shadow-md"
                  >
                    <FaPrint /> Print Report
                  </button>
                </Link>
                
                <button
                  className="flex items-center gap-2 px-4 py-2 font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:outline-none shadow-md"
                  onClick={openModal}
                >
                  <FaPlus /> Add Machine
                </button>
              </div>
            </div>

            {/* Machine Cards */}
            <div className="grid grid-cols-1 gap-6 mt-6" data-aos="fade-up" data-aos-delay="200">
              {machine.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow">
                  <p className="text-xl text-gray-500">No machines found</p>
                  <button
                    className="mt-4 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                    onClick={openModal}
                  >
                    Add Your First Machine
                  </button>
                </div>
              ) : (
                machine.map((machine, index) => {
                  const { nextRepairDate, remainingDays } = calculateNextRepairDate(
                    machine.lastRepairDate,
                    machine.repairTimePeriod
                  );
                  
                  const statusColor = getStatusColor(remainingDays);
                  
                  return (
                    <div 
                      key={machine._id} 
                      className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-green-500 hover:shadow-lg transition-shadow"
                      data-aos="fade-up" 
                      data-aos-delay={100 * (index % 5)}
                    >
                      <div className="p-6">
                        <div className="flex flex-wrap justify-between items-start mb-4">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-800">{machine.name}</h2>
                            <p className="text-sm text-gray-500">Location: {machine.location}</p>
                          </div>
                          
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                            {remainingDays <= 0 
                              ? "Maintenance Overdue" 
                              : `${remainingDays} days remaining`
                            }
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-500">Next Repair Date</div>
                            <div className="font-medium">{nextRepairDate}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Repair Interval</div>
                            <div className="font-medium">{machine.repairTimePeriod} days</div>
                          </div>
                          
                          {machine.location === "Vehicle" && (
                            <>
                              <div>
                                <div className="text-sm text-gray-500">Vehicle Number</div>
                                <div className="font-medium">{machine.vehicalNO || "N/A"}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Capacity</div>
                                <div className="font-medium">{machine.capacity || "N/A"}</div>
                              </div>
                            </>
                          )}
                        </div>
                        
                        <div className="mb-4">
                          <div className="text-sm text-gray-500 mb-1">Description</div>
                          <p className="text-gray-700">{machine.discription}</p>
                        </div>
                        
                        {/* Collapsible Sections */}
                        <div className="space-y-3">
                          {/* Parts Section */}
                          <div className="border border-gray-200 rounded-lg">
                            <div 
                              className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50"
                              onClick={() => toggleDetails("parts", machine._id)}
                            >
                              <h3 className="font-medium text-gray-700">Machine Parts</h3>
                              {details[`${machine._id}-parts`] ? <BsChevronUp /> : <BsChevronDown />}
                            </div>
                            
                            {details[`${machine._id}-parts`] && (
                              <div className="px-3 py-2 border-t border-gray-200">
                                {machine.parts && machine.parts.length > 0 ? (
                                  <ul className="space-y-1">
                                    {machine.parts.map((part, idx) => (
                                      <li key={idx} className="text-gray-600">{part || "N/A"}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-gray-500 italic">No parts listed</p>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Cost Section */}
                          <div className="border border-gray-200 rounded-lg">
                            <div 
                              className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50"
                              onClick={() => toggleDetails("cost", machine._id)}
                            >
                              <h3 className="font-medium text-gray-700">Cost Information</h3>
                              {details[`${machine._id}-cost`] ? <BsChevronUp /> : <BsChevronDown />}
                            </div>
                            
                            {details[`${machine._id}-cost`] && (
                              <div className="px-3 py-2 border-t border-gray-200">
                                {machine.cost && machine.cost.length > 0 ? (
                                  <ul className="space-y-1">
                                    {machine.cost.map((costItem, idx) => (
                                      <li key={idx} className="text-gray-600">{costItem || "N/A"}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-gray-500 italic">No cost information available</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 mt-4">
                          <Link to={`/m_update/${machine._id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-400">
                            <FaEdit className="mr-2" /> Update
                          </Link>
                          
                          <button 
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors focus:ring-2 focus:ring-red-400"
                            onClick={() => handleDelete(machine._id, machine.name)}
                          >
                            <MdDeleteForever className="mr-2" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Machine Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
          <div 
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            data-aos="zoom-in"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-green-800">Add New Machine</h2>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="px-6 py-4">
              <form onSubmit={addMachine} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Basic Information */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Machine Name*
                    </label>
                    <input
                      type="text"
                      placeholder="Enter machine name"
                      value={name}
                      onChange={(e) => setname(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <select
                      value={location}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    >
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {location === "Vehicle" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vehicle Number
                        </label>
                        <input
                          type="text"
                          value={vehicalNO}
                          onChange={(e) => setVehicalNO(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Capacity
                        </label>
                        <input
                          type="text"
                          value={capacity}
                          onChange={(e) => setCapacity(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Repair Date
                    </label>
                    <DatePicker
                      selected={lastRepairDate}
                      onChange={(date) => setLastRepairDate(date)}
                      dateFormat="dd/MM/yyyy"
                      maxDate={new Date()}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Repair Interval (days)*
                    </label>
                    <input
                      type="number"
                      placeholder="Enter number of days"
                      value={repairTimePeriod}
                      onChange={(e) => setperiod(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter machine description"
                    value={discription}
                    onChange={(e) => setDiscript(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    rows="3"
                  />
                </div>
                
                {/* Cost Section */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Cost Details
                    </label>
                    <button
                      type="button"
                      onClick={addCostInput}
                      className="text-sm text-green-600 hover:text-green-800"
                    >
                      + Add Cost Item
                    </button>
                  </div>
                  
                  {cost.map((value, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        type="text"
                        placeholder={`Cost item ${index + 1}`}
                        value={value}
                        onChange={(e) => handleCostChange(index, e.target.value)}
                      />
                      {cost.length > 1 && (
                        <button
                          type="button"
                          className="ml-2 px-2 text-red-600 hover:text-red-800"
                          onClick={() => removeCostInput(index)}
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Parts Section */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Machine Parts
                    </label>
                    <button
                      type="button"
                      onClick={addPartsInput}
                      className="text-sm text-green-600 hover:text-green-800"
                    >
                      + Add Part
                    </button>
                  </div>
                  
                  {parts.map((value, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        type="text"
                        placeholder={`Part ${index + 1}`}
                        value={value}
                        onChange={(e) => handlePartsChange(index, e.target.value)}
                      />
                      {parts.length > 1 && (
                        <button
                          type="button"
                          className="ml-2 px-2 text-red-600 hover:text-red-800"
                          onClick={() => removePartsInput(index)}
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 flex justify-end border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mr-3 px-5 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="px-5 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors focus:ring-2 focus:ring-green-500"
                  >
                    Add Machine
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}