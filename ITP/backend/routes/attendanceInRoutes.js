const express = require("express");
const router = express.Router();
const AttendanceIn = require("../models/employeModel/attendanceInModel");

// Check status (if already checked in today)
router.get("/checkStatus/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;
    
    const existingRecord = await AttendanceIn.findOne({
      userid: userId,
      date: date
    });
    
    res.json({ exists: !!existingRecord });
  } catch (error) {
    console.error("Error checking attendance status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark attendance in
router.post("/mark_in", async (req, res) => {
  try {
    const { userid, intime, date } = req.body;
    
    // Check if already marked in
    const existingRecord = await AttendanceIn.findOne({
      userid: userid,
      date: date
    });
    
    if (existingRecord) {
      return res.status(409).json({ message: "Already checked in today" });
    }
    
    // Create new attendance record
    const newAttendance = new AttendanceIn({
      userid,
      intime,
      date
    });
    
    await newAttendance.save();
    res.status(201).json({ message: "Check-in successful", data: newAttendance });
  } catch (error) {
    console.error("Error marking in:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all check-ins
router.get("/getalllmarkIn", async (req, res) => {
  try {
    const attendanceRecords = await AttendanceIn.find().sort({ date: -1 });
    res.json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;