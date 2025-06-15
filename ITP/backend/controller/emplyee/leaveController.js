const Leaves = require("../../models/employeModel/leavesModel");

// Request Leave
const requestLeave = async (req, res) => {
    const { userid, fromdate, todate, description } = req.body;

    try {
        const newRequest = new Leaves({ userid, fromdate, todate, description });
        await newRequest.save();
        res.send("Requested Successfully!");
    } catch (error) {
        res.status(400).json({ error });
    }
};

// Get All Leave Requests
const getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leaves.find();
        res.json(leaves);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

// Cancel Leave Request
const cancelLeaveRequest = async (req, res) => {
    const { requestid } = req.body;

    try {
        const leaveRequest = await Leaves.findById(requestid);
        leaveRequest.status = 'Dissapproved';
        await leaveRequest.save();

        res.send("Leave request disapproved successfully");
    } catch (error) {
        res.status(400).json({ error });
    }
};

// Approve Leave Request
const approveLeaveRequest = async (req, res) => {
    const { requestid } = req.body;

    try {
        const leaveRequest = await Leaves.findById(requestid);
        leaveRequest.status = 'Approved';
        await leaveRequest.save();

        res.send("Leave request approved successfully");
    } catch (error) {
        res.status(400).json({ error });
    }
};

// Get Leave Requests by User ID
const getLeavesByUserId = async (req, res) => {
    const { userid } = req.body;

    try {
        const leaves = await Leaves.find({ userid });
        res.json(leaves);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Counts of Each Status
const getStatusCounts = async (req, res) => {
    try {
        const pendingCount = await Leaves.countDocuments({ status: 'Pending' });
        const approvedCount = await Leaves.countDocuments({ status: 'Approved' });
        const disapprovedCount = await Leaves.countDocuments({ status: 'Dissapproved' });

        const totalCount = pendingCount + approvedCount + disapprovedCount;

        res.json({
            pending: {
                count: pendingCount,
                percentage: ((pendingCount / totalCount) * 100).toFixed(2),
            },
            approved: {
                count: approvedCount,
                percentage: ((approvedCount / totalCount) * 100).toFixed(2),
            },
            disapproved: {
                count: disapprovedCount,
                percentage: ((disapprovedCount / totalCount) * 100).toFixed(2),
            },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Leave Status Counts by User
const getUserLeaveCounts = async (req, res) => {
    const { userid } = req.params;

    try {
        const pendingCount = await Leaves.countDocuments({ userid, status: 'Pending' });
        const approvedCount = await Leaves.countDocuments({ userid, status: 'Approved' });
        const disapprovedCount = await Leaves.countDocuments({ userid, status: 'Dissapproved' });

        res.json({
            userid,
            pending: pendingCount,
            approved: approvedCount,
            disapproved: disapprovedCount,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    requestLeave,
    getAllLeaves,
    cancelLeaveRequest,
    approveLeaveRequest,
    getLeavesByUserId,
    getStatusCounts,
    getUserLeaveCounts
};