const express = require("express");
const router = express.Router();
const {
    requestLeave,
    getAllLeaves,
    cancelLeaveRequest,
    approveLeaveRequest,
    getLeavesByUserId,
    getStatusCounts,
    getUserLeaveCounts
} = require("../controller/emplyee/leaveController");

// Routes
router.post("/leaverequest", requestLeave);
router.get("/getallleaves", getAllLeaves);
router.post("/cancelrequest", cancelLeaveRequest);
router.post("/approverequest", approveLeaveRequest);
router.post("/getleaverequestedbyuserid", getLeavesByUserId);
router.get("/statuscounts", getStatusCounts);
router.get("/leaverequestcounts/:userid", getUserLeaveCounts);

module.exports = router;