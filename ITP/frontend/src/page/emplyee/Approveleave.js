import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  Table, 
  Tag, 
  Button, 
  Modal, 
  Typography, 
  Space, 
  Tooltip, 
  DatePicker, 
  Select,
  Dropdown,
  Menu,
  Input
} from "antd";
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  EyeOutlined,
  MoreOutlined,
  EditOutlined,
  SearchOutlined,
  SettingOutlined
} from "@ant-design/icons";
import moment from "moment";
import Swal from "sweetalert2";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Search } = Input;

function Approveleave() {
  // State Management
  const [approveleaves, setApproveleaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersMap, setUsersMap] = useState({});
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchText, setSearchText] = useState("");

  // Centralized API Error Handling
  const handleApiError = useCallback((error, errorMessage) => {
    console.error(`${errorMessage}:`, error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
      footer: 'Please try again later'
    });
  }, []);

  // Fetch Data with Robust Error Handling
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [leavesRes, usersRes] = await Promise.all([
        axios.get("http://localhost:3000/api/leaves/getallleaves"),
        axios.get("http://localhost:3000/api/users/getallusers"),
      ]);

      setApproveleaves(leavesRes.data);
      setFilteredLeaves(leavesRes.data);

      const userMapData = usersRes.data.reduce((acc, user) => {
        acc[user._id] = user.fullName;
        return acc;
      }, {});

      setUsersMap(userMapData);
    } catch (error) {
      handleApiError(error, "Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Apply Filters with Comprehensive Logic
  const applyFilters = useCallback(() => {
    let filtered = approveleaves;

    // Status Filter
    if (filterStatus) {
      filtered = filtered.filter(leave => leave.status === filterStatus);
    }

    // Date Range Filter
    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(leave => 
        moment(leave.fromdate).isBetween(dateRange[0], dateRange[1], 'day', '[]')
      );
    }

    // Search Filter
    if (searchText) {
      filtered = filtered.filter(leave => 
        usersMap[leave.userid].toLowerCase().includes(searchText.toLowerCase()) ||
        leave.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredLeaves(filtered);
  }, [approveleaves, filterStatus, dateRange, searchText, usersMap]);

  // Use effect to trigger filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Status Color Mapping
  const getStatusColor = (status) => {
    const colorMap = {
      'Pending': 'orange',
      'Approved': 'green',
      'Rejected': 'red'
    };
    return colorMap[status] || 'default';
  };

  // Leave Request Status Update Methods
  const updateLeaveStatus = useCallback(async (
    requestId, 
    endpoint, 
    successMessage
  ) => {
    try {
      setLoading(true);
      await axios.post(endpoint, { requestid: requestId });
      
      const updatedLeaves = approveleaves.map(leave => 
        leave._id === requestId 
          ? { ...leave, status: endpoint.includes('approve') ? 'Approved' : 'Rejected' } 
          : leave
      );
      
      setApproveleaves(updatedLeaves);
      setFilteredLeaves(updatedLeaves);
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: successMessage,
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      handleApiError(error, "Failed to update leave status");
    } finally {
      setLoading(false);
    }
  }, [approveleaves, handleApiError]);

  // Specific approval and disapproval methods
  const approve = (requestId) => 
    updateLeaveStatus(
      requestId, 
      "http://localhost:3000/api/leaves/approverequest", 
      "Leave request approved successfully"
    );

  const disapprove = (requestId) => 
    updateLeaveStatus(
      requestId, 
      "http://localhost:3000/api/leaves/cancelrequest", 
      "Leave request rejected successfully"
    );

  // Enhanced action handlers
  const handleLeaveDetails = (record) => {
    setSelectedLeave(record);
  };

  const confirmLeaveAction = (record, action) => {
    Swal.fire({
      title: `Are you sure you want to ${action} this leave request?`,
      html: `
        <div>
          <p><strong>Employee:</strong> ${usersMap[record.userid]}</p>
          <p><strong>Dates:</strong> ${moment(record.fromdate).format('DD MMM YYYY')} to ${moment(record.todate).format('DD MMM YYYY')}</p>
          <p><strong>Reason:</strong> ${record.description}</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: action === 'approve' ? '#3085d6' : '#d33',
      cancelButtonColor: '#grey',
      confirmButtonText: action === 'approve' ? 'Yes, Approve' : 'Yes, Reject'
    }).then((result) => {
      if (result.isConfirmed) {
        action === 'approve' ? approve(record._id) : disapprove(record._id);
      }
    });
  };

  // Enhanced Actions Dropdown Menu
  const getActionMenu = (record) => (
    <Menu>
      <Menu.Item 
        key="view" 
        icon={<EyeOutlined />} 
        onClick={() => handleLeaveDetails(record)}
      >
        View Details
      </Menu.Item>
      {record.status === 'Pending' && (
        <>
          <Menu.Item 
            key="approve" 
            icon={<CheckCircleOutlined />} 
            onClick={() => confirmLeaveAction(record, 'approve')}
          >
            Approve Leave
          </Menu.Item>
          <Menu.Item 
            key="reject" 
            icon={<CloseCircleOutlined />} 
            danger
            onClick={() => confirmLeaveAction(record, 'reject')}
          >
            Reject Leave
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  // Table Columns Configuration
  const columns = [
    {
      title: 'Employee Name',
      dataIndex: 'userid',
      key: 'userid',
      render: (userid) => usersMap[userid] || userid,
      sorter: (a, b) => 
        (usersMap[a.userid] || '').localeCompare(usersMap[b.userid] || '')
    },
    {
      title: 'From Date',
      dataIndex: 'fromdate',
      key: 'fromdate',
      render: (date) => moment(date).format('DD MMM YYYY'),
      sorter: (a, b) => new Date(a.fromdate) - new Date(b.fromdate)
    },
    {
      title: 'To Date',
      dataIndex: 'todate',
      key: 'todate',
      render: (date) => moment(date).format('DD MMM YYYY'),
      sorter: (a, b) => new Date(a.todate) - new Date(b.todate)
    },
    {
      title: 'Reason',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Approved', value: 'Approved' },
        { text: 'Rejected', value: 'Rejected' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (record) => (
        <Dropdown 
          overlay={getActionMenu(record)} 
          trigger={['click']}
          placement="bottomRight"
        >
          <Button 
            type="text" 
            icon={<SettingOutlined/>} 
            className="hover:bg-gray-100 rounded-full"
          />
        </Dropdown>
      )
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Title level={2} className="text-center mb-6">
        Employee Leave Request
      </Title>

      {/* Filters Section */}
      <div className="mb-6 flex justify-between items-center">
        <Space>
          <Search
            placeholder="Search by employee or reason"
            allowClear
            style={{ width: 250 }}
            onSearch={(value) => setSearchText(value)}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <Select
            placeholder="Filter by Status"
            style={{ width: 150 }}
            allowClear
            onChange={(value) => setFilterStatus(value)}
          >
            <Select.Option value="Pending">Pending</Select.Option>
            <Select.Option value="Approved">Approved</Select.Option>
            <Select.Option value="Rejected">Rejected</Select.Option>
          </Select>

          <RangePicker 
            onChange={(dates) => setDateRange(dates)}
          />
        </Space>
      </div>

      {/* Leave Requests Table */}
      <Table 
        columns={columns}
        dataSource={filteredLeaves}
        loading={loading}
        rowKey="_id"
        pagination={{ 
          showSizeChanger: true, 
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} leave requests`
        }}
      />

      {/* Details Modal */}
      {selectedLeave && (
        <Modal
          title="Leave Request Details"
          visible={!!selectedLeave}
          onCancel={() => setSelectedLeave(null)}
          footer={[
            <Button key="close" onClick={() => setSelectedLeave(null)}>
              Close
            </Button>
          ]}
        >
          <div>
            <p><strong>Employee:</strong> {usersMap[selectedLeave.userid]}</p>
            <p><strong>From Date:</strong> {moment(selectedLeave.fromdate).format('DD MMM YYYY')}</p>
            <p><strong>To Date:</strong> {moment(selectedLeave.todate).format('DD MMM YYYY')}</p>
            <p><strong>Reason:</strong> {selectedLeave.description}</p>
            <p><strong>Status:</strong> 
              <Tag color={getStatusColor(selectedLeave.status)}>
                {selectedLeave.status}
              </Tag>
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Approveleave;