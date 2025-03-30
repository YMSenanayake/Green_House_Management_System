import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  Table, Tag, Button, Modal, Typography, Space, Tooltip, DatePicker, Select,Dropdown,Menu,Input,Card,Divider,Avatar,Badge,Statistic,Row,Col,Empty} from "antd";
import { 
  CheckCircleOutlined, CloseCircleOutlined, EyeOutlined,SearchOutlined,SettingOutlined,FilterOutlined,CalendarOutlined,ReloadOutlined,UsergroupAddOutlined,ClockCircleOutlined,FileTextOutlined,BellOutlined
} from "@ant-design/icons";
import moment from "moment";
import Swal from "sweetalert2";
import Adminnavbar from "./component/Adminnavbar";
import Navbar from "../../components/header/Navbar";

const { Title, Text, Paragraph } = Typography;
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
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // Enhanced UI Colors with Green Palette
  const UI_COLORS = {
    PRIMARY: '#2ecc71',       // Vibrant Green
    SECONDARY: '#27ae60',     // Dark Green
    SUCCESS: '#27ae60',       // Success Green
    ERROR: '#e74c3c',         // Soft Red
    WARNING: '#f39c12',       // Amber
    BACKGROUND: '#f0f5f0',    // Light Green-Tinted Background
    TEXT: '#2c3e50',          // Dark Slate Gray
    PENDING: '#f39c12',       // Amber for pending
    APPROVED: '#27ae60',      // Green for approved
    REJECTED: '#e74c3c'       // Red for rejected
  };

  // Centralized API Error Handling
  const handleApiError = useCallback((error, errorMessage) => {
    console.error(`${errorMessage}:`, error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
      footer: 'Please try again later',
      confirmButtonColor: UI_COLORS.PRIMARY
    });
  }, []);

  // Calculate statistics based on leave data
  const calculateStats = useCallback((leaves) => {
    const total = leaves.length;
    const pending = leaves.filter(leave => leave.status === 'Pending').length;
    const approved = leaves.filter(leave => leave.status === 'Approved').length;
    const rejected = leaves.filter(leave => leave.status === 'Rejected').length;
    
    setStats({ total, pending, approved, rejected });
  }, []);

  // Fetch Data with Robust Error Handling
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [leavesRes, usersRes] = await Promise.all([
        axios.get("http://localhost:3000/api/leaves/getallleaves"),
        axios.get("http://localhost:3000/api/users/getallusers"),
      ]);

      const leavesData = leavesRes.data;
      setApproveleaves(leavesData);
      setFilteredLeaves(leavesData);
      calculateStats(leavesData);

      const userMapData = usersRes.data.reduce((acc, user) => {
        acc[user._id] = user.fullName;
        return acc;
      }, {});

      setUsersMap(userMapData);
      
      // Success notification
      Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      }).fire({
        icon: 'success',
        title: 'Data refreshed successfully'
      });
      
    } catch (error) {
      handleApiError(error, "Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  }, [handleApiError, calculateStats]);

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
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(leave => 
        (usersMap[leave.userid] && usersMap[leave.userid].toLowerCase().includes(searchLower)) ||
        (leave.description && leave.description.toLowerCase().includes(searchLower))
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
      'Pending': UI_COLORS.PENDING,
      'Approved': UI_COLORS.APPROVED,
      'Rejected': UI_COLORS.REJECTED
    };
    return colorMap[status] || 'default';
  };

  // Status Icon Mapping
  const getStatusIcon = (status) => {
    const iconMap = {
      'Pending': <ClockCircleOutlined />,
      'Approved': <CheckCircleOutlined />,
      'Rejected': <CloseCircleOutlined />
    };
    return iconMap[status] || null;
  };

  // Calculate leave duration in days
  const calculateDuration = (fromDate, toDate) => {
    const from = moment(fromDate);
    const to = moment(toDate);
    return to.diff(from, 'days') + 1; // Include both start and end dates
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
      
      const newStatus = endpoint.includes('approve') ? 'Approved' : 'Rejected';
      
      const updatedLeaves = approveleaves.map(leave => 
        leave._id === requestId 
          ? { ...leave, status: newStatus } 
          : leave
      );
      
      setApproveleaves(updatedLeaves);
      setFilteredLeaves(updatedLeaves);
      calculateStats(updatedLeaves);
      
      // If we're updating the currently selected leave, update that too
      if (selectedLeave && selectedLeave._id === requestId) {
        setSelectedLeave({ ...selectedLeave, status: newStatus });
      }
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: successMessage,
        showConfirmButton: false,
        timer: 1500,
        background: '#f0fff0',
        iconColor: UI_COLORS.SUCCESS
      });
    } catch (error) {
      handleApiError(error, "Failed to update leave status");
    } finally {
      setLoading(false);
    }
  }, [approveleaves, handleApiError, calculateStats, selectedLeave]);

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
    const duration = calculateDuration(record.fromdate, record.todate);
    
    Swal.fire({
      title: `${action === 'approve' ? 'Approve' : 'Reject'} Leave Request`,
      html: `
        <div style="text-align: left;">
          <p><strong>Employee:</strong> ${usersMap[record.userid]}</p>
          <p><strong>Duration:</strong> ${duration} day${duration !== 1 ? 's' : ''}</p>
          <p><strong>Dates:</strong> ${moment(record.fromdate).format('DD MMM YYYY')} to ${moment(record.todate).format('DD MMM YYYY')}</p>
          <p><strong>Reason:</strong> ${record.description}</p>
        </div>
      `,
      icon: action === 'approve' ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: action === 'approve' ? UI_COLORS.SUCCESS : UI_COLORS.ERROR,
      cancelButtonColor: '#6c757d',
      confirmButtonText: action === 'approve' ? 'Approve Leave' : 'Reject Leave',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      backdrop: `rgba(46, 204, 113, 0.4)`
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
        icon={<EyeOutlined style={{ color: UI_COLORS.PRIMARY }} />} 
        onClick={() => handleLeaveDetails(record)}
      >
        View Details
      </Menu.Item>
      {record.status === 'Pending' && (
        <>
          <Menu.Divider />
          <Menu.Item 
            key="approve" 
            icon={<CheckCircleOutlined style={{ color: UI_COLORS.SUCCESS }} />} 
            onClick={() => confirmLeaveAction(record, 'approve')}
          >
            Approve Leave
          </Menu.Item>
          <Menu.Item 
            key="reject" 
            icon={<CloseCircleOutlined style={{ color: UI_COLORS.ERROR }} />} 
            danger
            onClick={() => confirmLeaveAction(record, 'reject')}
          >
            Reject Leave
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  // Generate avatar with first letter of name and color based on name
  const generateAvatar = (userid) => {
    const name = usersMap[userid] || '?';
    const initial = name.charAt(0).toUpperCase();
    
    // Generate consistent color based on name
    const colorIndex = name.charCodeAt(0) % 5;
    const colors = ['#2ecc71', '#3498db', '#9b59b6', '#e67e22', '#1abc9c'];
    const bgColor = colors[colorIndex];
    
    return (
      <Avatar 
        style={{ 
          backgroundColor: bgColor, 
          verticalAlign: 'middle',
          fontSize: '16px',
          fontWeight: 'bold'
        }} 
        size="large"
      >
        {initial}
      </Avatar>
    );
  };

  // Format date range as a readable string
  const formatDateRange = (fromdate, todate) => {
    const start = moment(fromdate);
    const end = moment(todate);
    const duration = end.diff(start, 'days') + 1;
    
    // If same day
    if (start.isSame(end, 'day')) {
      return `${start.format('DD MMM YYYY')} (1 day)`;
    }
    
    // If same month and year
    if (start.isSame(end, 'month') && start.isSame(end, 'year')) {
      return `${start.format('DD')} - ${end.format('DD MMM YYYY')} (${duration} days)`;
    }
    
    // Otherwise full format
    return `${start.format('DD MMM YYYY')} - ${end.format('DD MMM YYYY')} (${duration} days)`;
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterStatus(null);
    setDateRange([null, null]);
    setSearchText("");
    setFilteredLeaves(approveleaves);
  };

  // Columns Configuration
  const columns = [
    {
      title: 'Employee',
      dataIndex: 'userid',
      key: 'userid',
      render: (userid) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {generateAvatar(userid)}
          <Text 
            strong 
            style={{ 
              marginLeft: 12,
              color: UI_COLORS.TEXT
            }}
          >
            {usersMap[userid] || 'Unknown User'}
          </Text>
        </div>
      ),
      sorter: (a, b) => 
        (usersMap[a.userid] || '').localeCompare(usersMap[b.userid] || '')
    },
    {
      title: 'Leave Period',
      key: 'leaveperiod',
      render: (record) => (
        <div>
          <div style={{ fontWeight: '500' }}>
            {formatDateRange(record.fromdate, record.todate)}
          </div>
          <div style={{ 
            fontSize: '12px',
            color: '#666',
            marginTop: '4px'
          }}>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {moment(record.fromdate).fromNow()}
          </div>
        </div>
      ),
      sorter: (a, b) => new Date(a.fromdate) - new Date(b.fromdate)
    },
    {
      title: 'Reason',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <Tooltip title={text}>
          <div style={{ 
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            <FileTextOutlined style={{ marginRight: 8, color: UI_COLORS.PRIMARY }} />
            {text}
          </div>
        </Tooltip>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          icon={getStatusIcon(status)}
          color={getStatusColor(status)}
          style={{ 
            borderRadius: '12px',
            padding: '4px 12px',
            fontWeight: '500',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          {status}
        </Tag>
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
            type="primary"
            shape="circle"
            icon={<SettingOutlined />} 
            style={{ 
              backgroundColor: record.status === 'Pending' ? UI_COLORS.PRIMARY : '#f7f7f7',
              color: record.status === 'Pending' ? 'white' : '#666',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
        </Dropdown>
      )
    }
  ];


  // Return the component UI
  return (
    <div 
    className="pl-10 ml-60 min-h-screen"
    style={{ 
      background: `linear-gradient(135deg, ${UI_COLORS.BACKGROUND} 0%, #ffffff 100%)`,
      color: UI_COLORS.TEXT
    }}
    >     
    <Navbar/>
      <Adminnavbar/>

      <Card 
        className="shadow-lg rounded-xl"
        style={{ 
          borderColor: UI_COLORS.PRIMARY,
          backgroundColor: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(46,204,113,0.1)'
        }}
        extra={
          <Tooltip title="Refresh Data">
            <Button 
              icon={<ReloadOutlined />} 
              type="primary"
              shape="circle"
              style={{ 
                backgroundColor: UI_COLORS.PRIMARY,
                borderColor: UI_COLORS.PRIMARY,
                boxShadow: '0 2px 8px rgba(46,204,113,0.2)'
              }}
              onClick={fetchData}
              loading={loading}
            />
          </Tooltip>
        }
      >
        <Title 
          level={2} 
          className="text-center mb-6"
          style={{ 
            color: UI_COLORS.PRIMARY,
            borderBottomColor: UI_COLORS.PRIMARY,
            paddingBottom: 10,
            borderBottomWidth: 2,
            borderBottomStyle: 'solid',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CalendarOutlined style={{ marginRight: 12, color: UI_COLORS.SECONDARY }} />
          Employee Leave Management
        </Title>

        {/* Statistics Cards */}
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card 
              style={{ 
                backgroundColor: '#f0fff0',
                borderRadius: '8px',
                borderLeft: `4px solid ${UI_COLORS.PRIMARY}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <Statistic 
                title="Total Requests" 
                value={stats.total} 
                valueStyle={{ color: UI_COLORS.PRIMARY }}
                prefix={<UsergroupAddOutlined />} 
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card 
              style={{ 
                backgroundColor: '#fff9e6',
                borderRadius: '8px',
                borderLeft: `4px solid ${UI_COLORS.PENDING}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <Statistic 
                title="Pending" 
                value={stats.pending} 
                valueStyle={{ color: UI_COLORS.PENDING }}
                prefix={<ClockCircleOutlined />} 
              />
              {stats.pending > 0 && (
                <Badge 
                  count={stats.pending} 
                  style={{ 
                    backgroundColor: UI_COLORS.PENDING,
                    position: 'absolute',
                    top: '8px',
                    right: '8px'
                  }} 
                />
              )}
            </Card>
          </Col>
          <Col span={6}>
            <Card 
              style={{ 
                backgroundColor: '#e6fff0',
                borderRadius: '8px',
                borderLeft: `4px solid ${UI_COLORS.APPROVED}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <Statistic 
                title="Approved" 
                value={stats.approved} 
                valueStyle={{ color: UI_COLORS.APPROVED }}
                prefix={<CheckCircleOutlined />} 
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card 
              style={{ 
                backgroundColor: '#ffe6e6',
                borderRadius: '8px',
                borderLeft: `4px solid ${UI_COLORS.REJECTED}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <Statistic 
                title="Rejected" 
                value={stats.rejected} 
                valueStyle={{ color: UI_COLORS.REJECTED }}
                prefix={<CloseCircleOutlined />} 
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card 
          type="inner" 
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FilterOutlined style={{ color: UI_COLORS.PRIMARY, marginRight: 8 }} />
              <span>Filters</span>
            </div>
          }
          extra={
            <Button 
              type="text" 
              icon={<ReloadOutlined />} 
              onClick={resetFilters}
              style={{ color: UI_COLORS.PRIMARY }}
            >
              Reset
            </Button>
          }
          className="mb-6"
          style={{ 
            borderColor: UI_COLORS.PRIMARY,
            backgroundColor: '#f9fff9',
            borderRadius: '8px'
          }}
        >
          <Space direction="horizontal" size="middle" wrap>
            <Search
              placeholder="Search by employee or reason"
              allowClear
              style={{ width: 250 }}
              prefix={<SearchOutlined style={{ color: UI_COLORS.PRIMARY }} />}
              onSearch={(value) => setSearchText(value)}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />

            <Select
              placeholder="Filter by Status"
              style={{ width: 150 }}
              allowClear
              onChange={(value) => setFilterStatus(value)}
              value={filterStatus}
              suffixIcon={<FilterOutlined style={{ color: UI_COLORS.PRIMARY }} />}
              dropdownStyle={{ borderRadius: '8px' }}
            >
              <Select.Option value="Pending">
                <ClockCircleOutlined style={{ color: UI_COLORS.PENDING, marginRight: 8 }} />
                Pending
              </Select.Option>
              <Select.Option value="Approved">
                <CheckCircleOutlined style={{ color: UI_COLORS.APPROVED, marginRight: 8 }} />
                Approved
              </Select.Option>
              <Select.Option value="Rejected">
                <CloseCircleOutlined style={{ color: UI_COLORS.REJECTED, marginRight: 8 }} />
                Rejected
              </Select.Option>
            </Select>

            <RangePicker 
              style={{ 
                borderColor: UI_COLORS.PRIMARY,
                outline: 'none',
                borderRadius: '6px'
              }}
              onChange={(dates) => setDateRange(dates)}
              value={dateRange}
              format="DD/MM/YYYY"
              placeholder={['Start date', 'End date']}
              ranges={{
                'Today': [moment(), moment()],
                'This Week': [moment().startOf('week'), moment().endOf('week')],
                'This Month': [moment().startOf('month'), moment().endOf('month')]
              }}
            />
          </Space>
        </Card>

        {/* Table */}
        <Table 
          columns={columns}
          dataSource={filteredLeaves}
          loading={loading}
          rowKey="_id"
          pagination={{ 
            showSizeChanger: true, 
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} leave requests`,
            size: 'default',
            style: { color: UI_COLORS.PRIMARY }
          }}
          rowClassName={(record) => {
            switch(record.status) {
              case 'Pending': return 'bg-yellow-50 hover:bg-yellow-100';
              case 'Approved': return 'bg-green-50 hover:bg-green-100';
              case 'Rejected': return 'bg-red-50 hover:bg-red-100';
              default: return '';
            }
          }}
          locale={{
            emptyText: (
              <Empty 
                description="No leave requests found" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )
          }}
          style={{ 
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        />
      </Card>

      {/* Modal for leave details */}
      {selectedLeave && (
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <EyeOutlined style={{ marginRight: 10, color: UI_COLORS.PRIMARY }} />
              <span style={{ color: UI_COLORS.PRIMARY }}>Leave Request Details</span>
            </div>
          }
          visible={!!selectedLeave}
          onCancel={() => setSelectedLeave(null)}
          footer={
            selectedLeave.status === 'Pending' ? [
              <Button 
                key="reject" 
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => confirmLeaveAction(selectedLeave, 'reject')}
                style={{ 
                  borderRadius: '6px'
                }}
              >
                Reject
              </Button>,
              <Button 
                key="approve" 
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => confirmLeaveAction(selectedLeave, 'approve')}
                style={{ 
                  backgroundColor: UI_COLORS.SUCCESS,
                  borderColor: UI_COLORS.SUCCESS,
                  borderRadius: '6px'
                }}
              >
                Approve
              </Button>,
              <Button 
                key="close" 
                onClick={() => setSelectedLeave(null)}
                style={{ 
                  borderRadius: '6px'
                }}
              >
                Close
              </Button>
            ] : [
              <Button 
                key="close" 
                type="primary"
                onClick={() => setSelectedLeave(null)}
                style={{ 
                  backgroundColor: UI_COLORS.PRIMARY, 
                  borderColor: UI_COLORS.PRIMARY,
                  borderRadius: '6px'
                }}
              >
                Close
              </Button>
            ]
          }
          width={500}
          bodyStyle={{ 
            padding: '20px',
            backgroundColor: '#f9fff9'
          }}
          maskStyle={{ 
            backgroundColor: 'rgba(0,0,0,0.65)'
          }}
          style={{
            borderRadius: '12px',
            overflow: 'hidden'
          }}
        >
          <Card 
            style={{ 
              backgroundColor: '#ffffff',
              borderColor: UI_COLORS.PRIMARY,
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              {generateAvatar(selectedLeave.userid)}
              <div style={{ marginLeft: '12px' }}>
                <Text strong style={{ fontSize: '16px', color: UI_COLORS.TEXT, display: 'block' }}>
                  {usersMap[selectedLeave.userid]}
                </Text>
                <Tag 
                  color={getStatusColor(selectedLeave.status)}
                  icon={getStatusIcon(selectedLeave.status)}
                  style={{ 
                    marginTop: '4px',
                    borderRadius: '12px',
                    padding: '2px 10px'
                  }}
                >
                  {selectedLeave.status}
                </Tag>
              </div>
            </div>
            
            <Divider style={{ borderColor: UI_COLORS.PRIMARY, margin: '12px 0' }} />
            
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <CalendarOutlined style={{ color: UI_COLORS.PRIMARY, marginRight: '10px', marginTop: '4px' }} />
                <div>
                  <Text strong style={{ color: UI_COLORS.TEXT, display: 'block' }}>Leave Period</Text>
                  <Text style={{ color: UI_COLORS.SECONDARY }}>
                    {formatDateRange(selectedLeave.fromdate, selectedLeave.todate)}
                  </Text>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <FileTextOutlined style={{ color: UI_COLORS.PRIMARY, marginRight: '10px', marginTop: '4px' }} />
                <div>
                  <Text strong style={{ color: UI_COLORS.TEXT, display: 'block' }}>Reason for Leave</Text>
                  <Text style={{ color: UI_COLORS.SECONDARY, whiteSpace: 'pre-wrap' }}>
                    {selectedLeave.description}
                  </Text>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <BellOutlined style={{ color: UI_COLORS.PRIMARY, marginRight: '10px', marginTop: '4px' }} />
                <div>
                  <Text strong style={{ color: UI_COLORS.TEXT, display: 'block' }}>Request Submitted</Text>
                  <Text style={{ color: UI_COLORS.SECONDARY }}>
                    {moment(selectedLeave.createdAt || new Date()).format('DD MMM YYYY [at] HH:mm')}
                    <span style={{ marginLeft: '8px', color: '#666' }}>
                      ({moment(selectedLeave.createdAt || new Date()).fromNow()})
                    </span>
                  </Text>
                </div>
              </div>
            </Space>
          </Card>
        </Modal>
      )}
    </div>
  );
}

export default Approveleave;