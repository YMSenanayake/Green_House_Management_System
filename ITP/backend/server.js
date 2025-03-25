require("dotenv").config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Import Database Connection
require("./db");

const usersRoute = require("./routes/usersRoute");
const leaveRoute= require("./routes/leavesRoutes")

app.use("/api/users", usersRoute);
app.use("/api/leaves", leaveRoute);

// Define Routes (Example)
app.get("/", (req, res) => {
  res.send( "Server is running!");
});

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
