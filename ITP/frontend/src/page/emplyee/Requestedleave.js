import React, { useState, useEffect } from "react";
import moment from "moment";
import { DatePicker, Tooltip } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  Calendar as CalendarIcon, 
  Send as SendIcon, 
  Clock as PendingIcon, 
  CheckCircle as ApprovedIcon, 
  XCircle as RejectedIcon,
  FileText as FileTextIcon
} from "lucide-react";

const { RangePicker } = DatePicker;

function Requestedleave() {
  const [fromdate, setFromDate] = useState(null);
  const [todate, setToDate] = useState(null);
  const [description, setDescription] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Handle date selection with additional validation
  const filterByDate = (dates) => {
    if (dates && dates.length === 2) {
      const [start, end] = dates;
      
      // Validate date range
      if (start.isAfter(end)) {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid Date Range',
          text: 'Start date must be before end date.',
          customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'bg-green-600 hover:bg-green-700 rounded-xl'
          }
        });
        return;
      }

      setFromDate(start);
      setToDate(end);
    }
  };

  // Submit leave request with enhanced validation
  const leaveRequest = async (e) => {
    e.preventDefault();

    // Comprehensive form validation
    if (!fromdate || !todate) {
      Swal.fire({
        icon: 'warning',
        title: 'Date Required',
        text: 'Please select a valid date range.',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'bg-green-600 hover:bg-green-700 rounded-xl'
        }
      });
      return;
    }

    if (description.trim().length < 10) {
      Swal.fire({
        icon: 'warning',
        title: 'Insufficient Description',
        text: 'Please provide a more detailed reason for your leave.',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'bg-green-600 hover:bg-green-700 rounded-xl'
        }
      });
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentuser"));
    const requestDetails = {
      userid: currentUser._id,
      fromdate: fromdate.format("DD-MM-YYYY"),
      todate: todate.format("DD-MM-YYYY"),
      description: description.trim(),
    };

    try {
      setLoading(true);
      await axios.post("http://localhost:3000/api/leaves/leaverequest", requestDetails);
      
      Swal.fire({
        icon: 'success',
        title: 'Leave Request Submitted',
        text: 'Your leave request has been processed successfully.',
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: 'rounded-2xl'
        }
      });
      
      // Reset form after successful submission
      setFromDate(null);
      setToDate(null);
      setDescription("");
      
      // Refresh leave list
      fetchLeaves();
      
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: error.response?.data?.message || 'Unable to submit leave request. Please try again.',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'bg-red-600 hover:bg-red-700 rounded-xl'
        }
      });
    }
  };

  // Fetch leaves requested by current user
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const currentUser = JSON.parse(localStorage.getItem("currentuser"));
      const res = await axios.post("http://localhost:3000/api/leaves/getleaverequestedbyuserid", {
        userid: currentUser._id,
      });
      setLeaves(res.data.sort((a, b) => new Date(b.fromdate) - new Date(a.fromdate)));
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Status configuration for consistent styling
  const STATUS_CONFIG = {
    Pending: {
      color: 'text-green-600 bg-green-50 border-green-200',
      icon: PendingIcon,
      description: 'Your request is under review'
    },
    Approved: {
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      icon: ApprovedIcon,
      description: 'Leave request approved'
    },
    Rejected: {
      color: 'text-red-600 bg-red-50 border-red-200',
      icon: RejectedIcon,
      description: 'Leave request not approved'
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="container mx-auto max-w-6xl space-y-8">
        {/* Professional Header */}
        <div className="bg-white shadow-md rounded-2xl p-6 border-l-4 border-green-500">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <CalendarIcon className="mr-4 text-green-600" size={36} />
            Leave Management
          </h1>
          <p className="text-gray-500 mt-2">
            Submit and track your leave requests efficiently
          </p>
        </div>

        {/* Leave Request Form */}
        <div className="bg-white shadow-2xl rounded-3xl p-10 border-2 border-green-200 hover:shadow-xl transition-all duration-300">
  <form onSubmit={leaveRequest} className="grid md:grid-cols-3 gap-8">
    <div className="space-y-2">
      <label className="block text-md font-semibold text-gray-700 mb-3 flex items-center">
        <CalendarIcon className="mr-3 text-green-600" size={24} />
        Select Date Range
      </label>
      <RangePicker
        format="DD-MM-YYYY"
        onChange={filterByDate}
        value={[fromdate, todate]}
        className="w-full rounded-2xl border-green-300 hover:border-green-500 transition-colors"
        style={{
          height: '48px',
          padding: '0 12px'
        }}
        disabledDate={(current) => current && current < moment().startOf('day')}
      />
      <p className="text-xs text-gray-500 mt-2 pl-1">
        * Cannot select past dates
      </p>
    </div>

    <div className="space-y-2">
      <label className="block text-md font-semibold text-gray-700 mb-3 flex items-center">
        <FileTextIcon className="mr-3 text-green-600" size={24} />
        Leave Reason
      </label>
      <input
        placeholder="Enter your reason"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-4 py-3 rounded-2xl border-2 border-green-300 
                   focus:border-green-500 focus:ring-2 focus:ring-green-100 
                   transition-all resize-none text-gray-700
                   placeholder-gray-400"
      />
      <p className="text-xs text-gray-500 pl-1">
        * Minimum 10 characters required
      </p>
    </div>

    <div className="flex items-end">
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-4 rounded-2xl 
                   hover:bg-green-700 transition-all duration-300 
                   flex items-center justify-center gap-3
                   disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-md hover:shadow-lg mb-6"
      >
        
        {loading ? (
          <div className="animate-spin">
            <SendIcon size={24} className="text-white" />
          </div>
        ) : (
          <>
            <SendIcon size={24} />
            <span className="font-semibold">Submit Leave Request</span>
          </>
        )}
      </button>
      
    </div>
  </form>
</div>

        {/* Leave Requests Table */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="px-6 py-4 bg-green-50 border-b border-green-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Leave Requests
            </h2>
          </div>
          
          {leaves.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CalendarIcon size={48} className="mx-auto mb-4 text-green-300" />
              No leave requests found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-100">
                  <tr>
                    {['#', 'From', 'To', 'Duration', 'Reason', 'Status'].map((header) => (
                      <th 
                        key={header} 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave, index) => {
                    const StatusIcon = STATUS_CONFIG[leave.status]?.icon || CalendarIcon;
                    const statusConfig = STATUS_CONFIG[leave.status] || {};

                    return (
                      <tr 
                        key={leave._id} 
                        className="border-b hover:bg-green-50 transition-colors"
                      >
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4">{leave.fromdate}</td>
                        <td className="px-6 py-4">{leave.todate}</td>
                        <td className="px-6 py-4">
                          {moment(leave.todate, 'DD-MM-YYYY').diff(moment(leave.fromdate, 'DD-MM-YYYY'), 'days') + 1} days
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate">{leave.description}</td>
                        <td className="px-6 py-4">
                          <Tooltip title={statusConfig.description}>
                            <span 
                              className={`inline-flex items-center px-3 py-1 
                                         rounded-full text-xs font-medium 
                                         ${statusConfig.color} border`}
                            >
                              <StatusIcon size={16} className="mr-2" />
                              {leave.status}
                            </span>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Requestedleave;