import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit, FaSearch, FaFilter, FaPlus, FaFileDownload, FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";
import autoTable from 'jspdf-autotable';
import { useNavigate } from "react-router-dom";
import logo from "../../components/header/logo.png";
import Adminnavbar from "./component/Adminnavbar";

AOS.init({
  duration: 1500,
});

function Allusers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [duplicateUsers, setDuplicateUsers] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [type, setType] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  // Fetch users data
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:3000/api/users/getallusers"
      );
      setUsers(data);
      setDuplicateUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Modal handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    // Reset form fields
    setFullName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setCpassword("");
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

  // Add user
  async function addUser(event) {
    event.preventDefault();

    if (password !== cpassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (phone.length !== 10) {
      toast.error("Phone number must be 10 digits");
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
      closeModal();
      Swal.fire({
        title: "Success!",
        text: "User added successfully",
        icon: "success",
        confirmButtonColor: "#25D366",
      }).then(() => {
        fetchData();
      });
    } catch (error) {
      console.error("Add user error:", error);
      toast.error(error.response?.data?.message || "Failed to add user");
    } finally {
      setLoading(false);
    }
  }

  // Delete user
  const deleteUser = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This user will be permanently removed from the system",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#25D366",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        setLoading(true);
        await axios.delete(`http://localhost:3000/api/users/delete/${id}`);
        fetchData();
        toast.success("User deleted successfully");
      }
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  // Search and filter
  const filterBySearch = () => {
    const filteredBySearch = duplicateUsers.filter((user) =>
      user.fullName.toLowerCase().includes(searchKey.toLowerCase())
    );

    if (type !== "all") {
      const filteredByTypeAndSearch = filteredBySearch.filter(
        (user) => user.role && user.role.toLowerCase().includes(type)
      );
      setUsers(filteredByTypeAndSearch);
    } else {
      setUsers(filteredBySearch);
    }

    if (filteredBySearch.length === 0 && searchKey.trim() !== "") {
      toast.error("No users found matching your search");
    }
  };

  const filterByType = (e) => {
    const selectedType = e.target.value.toLowerCase();
    setType(selectedType);

    if (selectedType !== "all") {
      const filtered = duplicateUsers.filter(
        (user) => user.role && user.role.toLowerCase().includes(selectedType)
      );
      setUsers(filtered);
    } else {
      setUsers(duplicateUsers);
    }
  };

  // Generate PDF report
  const generateReport = () => {
    // Get current user or use fallback
    const currentUser = window.currentUser || 
      JSON.parse(localStorage.getItem('currentUser') || 'null') || 
      { fullName: 'System User' };
  
    // Check for data availability
    if (!users || users.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Data Available",
        text: "There are no users available to generate a report.",
        confirmButtonColor: "#25D366"
      });
      return;
    }
    
    // Confirm report generation
    Swal.fire({
      title: "Generate Users Report",
      html: "Do you want to create a <b>PDF report</b> containing all user data?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#25D366",
      cancelButtonColor: "#d33",
      confirmButtonText: "<i class='fas fa-file-pdf'></i> Generate Report"
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading state
        Swal.fire({
          title: "Generating Report",
          html: "<div class='progress-container'><div class='progress-bar'></div></div>",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });
        
        setTimeout(() => {
          try {
            // Initialize PDF document
            const doc = new jsPDF("p", "mm", "a4");
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            
            // Define color scheme
            const colors = {
              primary: [37, 211, 102],
              secondary: [240, 249, 245],
              text: [51, 51, 51],
              text2: [255, 255, 255]
            };
            
            // Calculate pagination
            const rowsPerPage = 25;
            const totalPages = Math.ceil(users.length / rowsPerPage) || 1;
            
            // Add header function
            const addHeader = () => {
              // Header background
              doc.setFillColor(...colors.primary, 0.1);
              doc.rect(0, 0, pageWidth, 35, 'F');
              
              // Add logo and title
              doc.addImage(logo, "png", 15, 10, 25, 15);
              
              doc.setFont("helvetica", "bold");
              doc.setFontSize(18);
              doc.setTextColor(...colors.text2);
              doc.text("GreenGrow User Management Report", pageWidth / 2, 22, { align: "center" });
              
              // Add metadata
              doc.setFont("helvetica", "normal");
              doc.setFontSize(9);
              doc.setTextColor(100, 100, 100);
              doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 20, 15, { align: "right" });
            };
            
            // Add footer function
            const addFooter = (pageNum) => {
              doc.setFillColor(...colors.primary);
              doc.rect(0, pageHeight - 15, pageWidth, 15, "F");
              
              doc.setTextColor(255, 255, 255);
              doc.setFontSize(9);
              doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: "center" });
              doc.text("© " + new Date().getFullYear() + " GreenGrow", 15, pageHeight - 5);
              doc.text("Confidential", pageWidth - 15, pageHeight - 5, { align: "right" });
            };
            
            // Add summary section
            const addSummary = (y) => {
              // Calculate role distribution and active users
              const roles = {};
              let activeUsers = 0;
              let inactiveUsers = 0;
              
              users.forEach(user => {
                const role = user.role || "Unassigned";
                roles[role] = (roles[role] || 0) + 1;
                if (typeof user.isActive !== 'undefined') {
                  user.isActive ? activeUsers++ : inactiveUsers++;
                }
              });
              
              // Draw summary container
              doc.setFillColor(...colors.secondary);
              doc.roundedRect(15, y, pageWidth - 30, 35, 3, 3, 'F');
              
              // Summary header
              doc.setFillColor(...colors.primary);
              doc.roundedRect(15, y, pageWidth - 30, 8, 3, 3, 'F');
              doc.setFont("helvetica", "bold");
              doc.setFontSize(12);
              doc.setTextColor(255, 255, 255);
              doc.text("DASHBOARD SUMMARY", pageWidth / 2, y + 5.5, { align: "center" });
              
              // Two-column layout
              const col1X = 25;
              const col2X = pageWidth / 2 + 10;
              
              // User statistics - left column
              doc.setFont("helvetica", "bold");
              doc.setFontSize(10);
              doc.setTextColor(...colors.primary);
              doc.text("User Statistics:", col1X, y + 15);
              
              doc.setFont("helvetica", "normal");
              doc.setFontSize(9);
              doc.setTextColor(80, 80, 80);
              doc.text(`Total Users: ${users.length}`, col1X, y + 21);
              doc.text(`Active Users: ${activeUsers} (${Math.round(activeUsers/users.length*100)}%)`, col1X, y + 26);
              doc.text(`Inactive Users: ${inactiveUsers} (${Math.round(inactiveUsers/users.length*100)}%)`, col1X, y + 31);
              
              // Role distribution - right column
              doc.setFont("helvetica", "bold");
              doc.setFontSize(10);
              doc.setTextColor(...colors.primary);
              doc.text("Role Distribution:", col2X, y + 15);
              
              doc.setFont("helvetica", "normal");
              doc.setFontSize(9);
              doc.setTextColor(80, 80, 80);
              
              let roleY = y + 21;
              Object.entries(roles).forEach(([role, count]) => {
                const percentage = Math.round((count / users.length) * 100);
                doc.text(`${role}: ${count} (${percentage}%)`, col2X, roleY);
                roleY += 5;
              });
              
              return y + 40;
            };
            
            // Table data setup
            const headers = ["Full Name", "Email Address", "Phone", "Role"];
            const tableData = users.map((user) => [
              user.fullName || "—",
              user.email || "—",
              user.phone || "—",
              user.role || "—",
            ]);
            
            // Generate table with styling
            autoTable(doc, {
              head: [headers],
              body: tableData,
              startY: 100, // Modified from 80 to 100 to move the table down
              theme: "grid",
              headStyles: {
                fillColor: colors.primary,
                textColor: [255, 255, 255],
                fontSize: 10,
                fontStyle: "bold",
                halign: 'center',
              },
              bodyStyles: {
                textColor: colors.text,
                fontSize: 9,
              },
              alternateRowStyles: {
                fillColor: colors.secondary
              },
              columnStyles: {
                0: { cellWidth: 40 },
                1: { cellWidth: 50 },
                2: { cellWidth: 30 },
                3: { cellWidth: 25, halign: 'center' },
                4: { cellWidth: 25, halign: 'center' }
              },
              margin: { top: 40, right: 15, bottom: 25, left: 30 },
              didDrawPage: (data) => {
                addHeader();
                addFooter(doc.internal.getNumberOfPages());
                
                // Only add summary on first page
                if (data.pageNumber === 1) {
                  addSummary(40);
                }
              },
              didDrawCell: (data) => {
                // Style status cells
                if (data.section === 'body' && data.column.index === 4) {
                  const status = data.cell.text[0];
                  if (status === 'Inactive') {
                    doc.setFillColor(250, 230, 230);
                    doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                    doc.setTextColor(220, 53, 69);
                    doc.text(status, data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2, {
                      align: 'center',
                      baseline: 'middle'
                    });
                  } else if (status === 'Active') {
                    doc.setFillColor(230, 250, 230);
                    doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                    doc.setTextColor(...colors.primary);
                    doc.text(status, data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2, {
                      align: 'center',
                      baseline: 'middle'
                    });
                  }
                }
              }
            });
            
            // Save PDF with timestamp in filename
            const timestamp = new Date().toISOString().replace(/[:T]/g, "-").split(".")[0];
            const filename = `GreenGrow_Users_Report_${timestamp}.pdf`;
            doc.save(filename);
            
            // Success message
            Swal.fire({
              icon: "success",
              title: "Report Generated Successfully!",
              html: `<p>Your report has been saved as: <b>${filename}</b></p>`,
              confirmButtonColor: "#25D366"
            });
            
            console.log(`User report generated: ${filename} by ${currentUser.fullName}`);
            
          } catch (error) {
            console.error("PDF Generation Error:", error);
            
            // Error handling
            Swal.fire({
              icon: "error",
              title: "Report Generation Failed",
              text: `Error: ${error.message || "Unknown error"}`,
              confirmButtonColor: "#25D366",
              confirmButtonText: "Try Again",
              showCancelButton: true
            }).then((result) => {
              if (result.isConfirmed) {
                setTimeout(() => generateReport(), 500);
              }
            });
          }
        }, 1000);
      }
    });
    
    // Add CSS for progress bar
    if (!document.getElementById('report-styles')) {
      const style = document.createElement('style');
      style.id = 'report-styles';
      style.innerHTML = `
        .progress-container {
          margin-top: 15px;
          width: 100%;
          background-color: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-bar {
         margin-top: 15px;
          height: 6px;
          background-color: #25D366;
          width: 0%;
          animation: progress 1.5s ease-in-out forwards;
        }
        @keyframes progress {
          0% { width: 0%; }
          90% { width: 95%; }
          100% { width: 95%; }
        }
      `;
      document.head.appendChild(style);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Adminnavbar />
      
      <div className="ml-64 p-6">
        {/* Page Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            User Management
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({users.length} users)
            </span>
          </h1>
          
          <div className="flex space-x-3">
            <button
              onClick={generateReport}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300 shadow-md"
            >
              <FaFileDownload />
              <span>Export PDF</span>
            </button>
            
            <button
              onClick={openModal}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300 shadow-md"
            >
              <FaPlus />
              <span>Add User</span>
            </button>
          </div>
        </div>
        
        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search users by name..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchKey}
                onChange={(e) => {
                  setSearchKey(e.target.value);
                  if (e.target.value === "") {
                    setUsers(duplicateUsers);
                  }
                }}
                onKeyUp={filterBySearch}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="relative min-w-[200px]">
              <select
                value={type}
                onChange={filterByType}
                className="appearance-none w-full pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="employee manager">Employee Manager</option>
                <option value="financial manager">Financial Manager</option>
                <option value="inventory manager">Inventory Manager</option>
                <option value="machine manager">Machine Manager</option>
              </select>
              <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        
        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden" data-aos="fade-up">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <FaSpinner className="text-green-600 text-3xl animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-sm text-white uppercase bg-green-600">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4 text-center">Image</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-100">
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 font-medium">{user.fullName}</td>
                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                        <td className="px-6 py-4">{user.phone}</td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <img
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
                              src={user.imageurl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.fullName) + "&background=25D366&color=fff"}
                              alt={user.fullName}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {user.role || "User"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center space-x-3">
                            <Link to={`/e_updates/${user._id}`} className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-full hover:bg-blue-50">
                              <FaEdit className="text-lg" />
                            </Link>
                            <button 
                              onClick={() => deleteUser(user._id)}
                              className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-full hover:bg-red-50"
                            >
                              <MdDeleteForever className="text-xl" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        {searchKey ? "No users match your search criteria" : "No users found in the system"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
          <div
            ref={modalRef}
            className="bg-white rounded-xl overflow-hidden shadow-2xl w-full max-w-md transform transition-all"
            data-aos="zoom-in"
          >
            <div className="bg-green-600 px-6 py-4 text-white">
              <h2 className="text-xl font-semibold">Add New User</h2>
            </div>

            <form onSubmit={addUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter user name"
                  value={fullName}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
                    setFullName(value);
                  }}
                  className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setPhone(value);
                    }
                  }}
                  className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Must be exactly 10 digits</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={cpassword}
                  onChange={(e) => setCpassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-1/2 py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-2" />
                      Saving...
                    </span>
                  ) : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Allusers;