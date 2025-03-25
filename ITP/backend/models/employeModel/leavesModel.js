const mongoose = require("mongoose");

const leaverequestSchema = mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  fromdate: {
    type: String,
    required: true,
  },
  todate: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
}, {
  timestamps: true,
});

const leavesModel = mongoose.model('leaves_request', leaverequestSchema);
module.exports = leavesModel;