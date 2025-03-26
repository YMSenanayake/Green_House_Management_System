import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit, FaSearch, FaFilter, FaPlus, FaFileDownload } from "react-icons/fa";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";
import "jspdf-autotable";
import autoTable from 'jspdf-autotable';
import { useNavigate } from "react-router-dom";
import logo from "../../components/header/logo.png";
 
// jsPDF and its plugins


AOS.init({
  duration: 2500,
});

function Allusers() {
  const [users, setusers] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [duplicateusers, setduplicateusers] = useState([]);
  const [searchkey, setsearchkey] = useState("");
  const [type, settype] = useState("all");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await axios.get(
        "http://localhost:3000/api/users/getallusers"
      );
      setusers(data.data);
      setduplicateusers(data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add users popup form state and functions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Add user form state
  const [fullName, setfullName] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");


  const logoBase64 = 'https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?ga=GA1.1.1249355359.1742841661&semt=ais_hybrid'; // Replace with actual logo

  async function adduser(event) {
    event.preventDefault();

    if (password === cpassword) {
      if (phone.length !== 10) {
        toast.error("Phone number must be 10 digits.");
        return;
      }

      const user = {
        fullName,
        email,
        phone,
        password,
        cpassword,
      };

      try {
        setLoading(true);
        const result = await axios.post(
          "http://localhost:3000/api/users/register",
          user
        );

        console.log(result.data);
        closeModal();
        Swal.fire("Congratulations", "User added successfully", "success").then(
          () => {
            window.location.reload();
          }
        );
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      toast.error("Password doesn't match");
    }
  }

  // Delete user function
  const deleteuser = async (id) => {
    try {
      setLoading(true);
      const confirmed = await Swal.fire({
        title: "Are you sure remove user?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (confirmed.isConfirmed) {
        await axios.delete(`http://localhost:3000/api/users/delete/${id}`);
        fetchData();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User deleted successfully!",
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Search and filter functions
  function filterBySearch() {
    const filteredBySearch = duplicateusers.filter((user) =>
      user.fullName.toLowerCase().includes(searchkey.toLowerCase())
    );

    if (type !== "all") {
      const filteredByTypeAndSearch = filteredBySearch.filter(
        (user) => user.role && user.role.toLowerCase().includes(type)
      );
      setusers(filteredByTypeAndSearch);
    } else {
      setusers(filteredBySearch);
    }

    if (filteredBySearch.length === 0) {
      toast.error("User not found.");
    }
  }

  function filterByType(e) {
    const selectedType = e.target.value.toLowerCase();
    settype(selectedType);

    if (selectedType !== "all") {
      const tempUsers = duplicateusers.filter(
        (user) => user.role && user.role.toLowerCase().includes(selectedType)
      );
      setusers(tempUsers);
    } else {
      setusers(duplicateusers);
    }
  }

  // Generate PDF report
  const generateReport = () => {
    if (!users || users.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Data",
        text: "There are no users to generate a report.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }
  
    Swal.fire({
      title: "Generate Users Report",
      text: "Do you want to create a professional PDF report?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Generate Report",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          const doc = new jsPDF("p", "mm", "a4");
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
  
          const colors = {
            primary: [41, 128, 186],
            secondary: [52, 152, 219],
            text: [0, 0, 0],
            background: [240, 240, 240],
          };
  
          // Add header function
          const addHeader = () => {
            doc.addImage(logo, "png", 15, 10, 40, 15);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.setTextColor(...colors.text);
            doc.text("Users Management Report", pageWidth / 2, 25, { align: "center" });
  
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 20, 20, { align: "right" });
          };
  
          // Add footer function
          const addFooter = (pageNum, totalPages) => {
            doc.setFillColor(...colors.primary);
            doc.rect(0, pageHeight - 15, pageWidth, 15, "F");
  
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(9);
            doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: "center" });
            doc.text("© " + new Date().getFullYear() + " User Management System", 15, pageHeight - 5);
            doc.text("Confidential", pageWidth - 15, pageHeight - 5, { align: "right" });
          };
  
          // Table Data
          const headers = ["Name", "Email", "Phone", "Role"];
          const tableData = users.map((user) => [
            user.fullName || "N/A",
            user.email || "N/A",
            user.phone || "N/A",
            user.role || "N/A",
          ]);
  
          // Generate Table
          autoTable(doc, {
            head: [headers],
            body: tableData,
            startY: 40,
            theme: "striped",
            headStyles: {
              fillColor: colors.primary,
              textColor: [255, 255, 255],
              fontSize: 11,
              fontStyle: "bold",
            },
            bodyStyles: {
              textColor: colors.text,
              fontSize: 10,
            },
            alternateRowStyles: {
              fillColor: colors.background,
            },
            columnStyles: {
              0: { cellWidth: 45 },
              1: { cellWidth: 55 },
              2: { cellWidth: 40 },
              3: { cellWidth: 40 },
            },
            didDrawPage: (data) => {
              addHeader();
              addFooter(doc.internal.getNumberOfPages(), doc.internal.getNumberOfPages());
            },
          });
  
          // Save PDF
          const timestamp = new Date().toISOString().replace(/[:T]/g, "-").split(".")[0];
          const filename = `Users_Report_${timestamp}.pdf`;
          doc.save(filename);
  
          Swal.fire({
            icon: "success",
            title: "Report Generated",
            text: `Professional PDF report saved as ${filename}`,
            confirmButtonColor: "#3085d6",
          });
        } catch (error) {
          console.error("PDF Generation Error:", error);
          Swal.fire({
            icon: "error",
            title: "PDF Generation Failed",
            text: error.message || "An unexpected error occurred",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
  };
  

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-[#F0F9F5] p-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by name..."
                className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-[#25D366] focus:outline-none focus:ring-2 focus:ring-[#1DA851] transition duration-300"
                value={searchkey}
                onChange={(e) => {
                  setsearchkey(e.target.value);
                }}
                onKeyUp={filterBySearch}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#25D366]" />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={type}
                onChange={filterByType}
                className="appearance-none w-full pl-4 pr-8 py-2 rounded-full border-2 border-[#25D366] bg-white text-[#25D366] focus:outline-none focus:ring-2 focus:ring-[#1DA851] transition duration-300"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="employee manager">Employee Manager</option>
                <option value="tunnel manager">Tunnel Manager</option>
                <option value="financial manager">Financial Manager</option>
                <option value="target manager">Target Manager</option>
                <option value="Courior servise">Courier Service</option>
                <option value="inventory manager">Inventory Manager</option>
                <option value="machine manager">Machine Manager</option>
              </select>
              <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#25D366] pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={generateReport}
              className="flex items-center space-x-2 bg-[#25D366] hover:bg-[#1DA851] text-white px-4 py-2 rounded-full transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#1DA851]"
            >
              <FaFileDownload />
              <span>Generate Report</span>
            </button>
            <button
              onClick={openModal}
              className="flex items-center space-x-2 bg-[#25D366] hover:bg-[#1DA851] text-white px-4 py-2 rounded-full transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#1DA851]"
            >
              <FaPlus />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table 
            data-aos="zoom-out"
            className="w-full text-sm text-left"
          >
            <thead className="bg-[#25D366] text-white">
              <tr>
                {['Name', 'Email', 'Phone', 'Image', 'Role', 'Actions'].map((header) => (
                  <th key={header} className="px-6 py-3 text-center">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-green-50 transition-colors duration-200`}
                  >
                    <td className="px-6 py-4 text-center">{user.fullName}</td>
                    <td className="px-6 py-4 text-center">{user.email}</td>
                    <td className="px-6 py-4 text-center">{user.phone}</td>
                    <td className="px-6 py-4 text-center">
                      <img
                        className="w-10 h-10 rounded-full mx-auto object-cover shadow-md"
                        src={user.imageurl}
                        alt="profile"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">{user.role}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <Link to={`/e_updates/${user._id}`}>
                          <button className="text-blue-500 hover:text-blue-700 transition duration-300">
                            <FaEdit className="text-xl" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => deleteuser(user._id)}
                          className="text-red-500 hover:text-red-700 transition duration-300"
                        >
                          <MdDeleteForever className="text-2xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-red-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
          <div
            ref={modalRef}
            className="bg-white rounded-3xl overflow-hidden shadow-xl max-w-md"
          >
            <div className="px-12 py-12">
              <h2 className="text-2xl font-semibold text-dark font-custom mb-6 tracking-wide">
                Enter the user's details
              </h2>

              <form onSubmit={adduser} className="space-y-5">
              <input
  type="text"
  placeholder="Enter user name"
  value={fullName}
  onChange={(e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, ""); // Allow only letters and numbers
    setfullName(value);
  }}
  className="w-full p-3 rounded-3xl bg-wight-green dark:bg-table-row border-none focus:outline-none focus:ring-2 focus:ring-whatsapp-green placeholder-gray-500 placeholder-opacity-70 font-custom text-md shadow-md transition-all duration-300"
  required
/>


                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  className="w-full p-3 rounded-3xl bg-wight-green dark:bg-table-row border-none focus:outline-none focus:ring-2 focus:ring-whatsapp-green placeholder-gray-500 placeholder-opacity-70 font-custom text-md shadow-md transition-all duration-300"
                  required
                />

<input
  type="text" // Change type to "text" to prevent issues with leading zeros
  placeholder="Enter phone"
  value={phone}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.length <= 10) {
      setphone(value);
    }
  }}
  onBlur={() => {
    if (phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits.");
    }
  }}
  className="w-full p-3 rounded-3xl bg-wight-green dark:bg-table-row border-none focus:outline-none focus:ring-2 focus:ring-whatsapp-green placeholder-gray-500 placeholder-opacity-70 font-custom text-md shadow-md transition-all duration-300"
  required
/>


                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  className="w-full p-3 rounded-3xl bg-wight-green dark:bg-table-row border-none focus:outline-none focus:ring-2 focus:ring-whatsapp-green placeholder-gray-500 placeholder-opacity-70 font-custom text-md shadow-md transition-all duration-300"
                  required
                />

                <input
                  type="password"
                  placeholder="Confirm password"
                  value={cpassword}
                  onChange={(e) => setcpassword(e.target.value)}
                  className="w-full p-3 rounded-3xl bg-wight-green dark:bg-table-row border-none focus:outline-none focus:ring-2 focus:ring-whatsapp-green placeholder-gray-500 placeholder-opacity-70 font-custom text-md shadow-md transition-all duration-300"
                  required
                />

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold rounded-full font-custom text-md transition-all duration-300 ease-in-out shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#1DA851]"
                  >
                    Submit
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

export default Allusers;