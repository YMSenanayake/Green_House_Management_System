const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load .env file

const machineRoutes = require('./routes/machineRoute');

const app = express();

// Middleware
app.use(express.json()); // Add this to parse JSON requests
app.use(cors()); // Allow cross-origin requests

// Database connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/machines', machineRoutes);

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
