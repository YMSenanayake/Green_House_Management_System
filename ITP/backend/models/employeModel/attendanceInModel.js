// File: models/attendanceInModel.js
const mongoose = require("mongoose");

const attendanceInSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true
  },
  intime: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
}, { timestamps: true });

const AttendanceIn = mongoose.model("AttendanceIn", attendanceInSchema);
module.exports = AttendanceIn;