const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cost: { type: [Number], required: true },
  parts: { type: [String], required: true },
  description: { type: String, required: true },
  location: { 
    type: String, 
    required: true,
    enum: ['poly_tunnel_01', 'poly_tunnel_02', 'poly_tunnel_03', 'Inventory', 'Vehicle']
  },
  lastRepairDate: { type: Date, required: true },
  repairTimePeriod: { type: Number, required: true },
  remainingDays: { type: Number },
  nextRepairDate: { type: Date },
  vehicleNO: { type: String },
  capacity: { type: Number },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

machineSchema.pre('save', function(next) {
  if (this.lastRepairDate && this.repairTimePeriod) {
    const nextRepair = new Date(this.lastRepairDate);
    nextRepair.setDate(nextRepair.getDate() + this.repairTimePeriod);
    this.nextRepairDate = nextRepair;
    
    const today = new Date();
    this.remainingDays = Math.ceil((nextRepair - today) / (1000 * 60 * 60 * 24));
  }
  next();
});

module.exports = mongoose.model('Machine', machineSchema);