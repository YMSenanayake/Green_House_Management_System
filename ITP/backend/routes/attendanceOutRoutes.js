const express = require("express");
const router = express.Router();
const AttendanceOut = require("../models/employeModel/attendanceOutModel");

// Check status (if already checked out today)
router.get("/checkStatus/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;
    
    const existingRecord = await AttendanceOut.findOne({
      userid: userId,
      date: date
    });
    
    res.json({ exists: !!existingRecord });
  } catch (error) {
    console.error("Error checking attendance status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark attendance out
router.post("/mark_out", async (req, res) => {
  try {
    const { userid, outtime, date } = req.body;
    
    // Check if already marked out
    const existingRecord = await AttendanceOut.findOne({
      userid: userid,
      date: date
    });
    
    if (existingRecord) {
      return res.status(409).json({ message: "Already checked out today" });
    }
    
    // Create new attendance record
    const newAttendance = new AttendanceOut({
      userid,
      outtime,
      date
    });
    
    await newAttendance.save();
    res.status(201).json({ message: "Check-out successful", data: newAttendance });
  } catch (error) {
    console.error("Error marking out:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all check-outs
router.get("/getalllmarkOut", async (req, res) => {
  try {
    const attendanceRecords = await AttendanceOut.find().sort({ date: -1 });
    res.json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;