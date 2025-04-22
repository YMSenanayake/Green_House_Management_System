// File: models/attendanceOutModel.js
const mongoose = require("mongoose");

const attendanceOutSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true
  },
  outtime: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
}, { timestamps: true });

const AttendanceOut = mongoose.model("AttendanceOut", attendanceOutSchema);
module.exports = AttendanceOut;