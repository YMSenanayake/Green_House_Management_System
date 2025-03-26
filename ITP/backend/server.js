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


//sample Route
app.get("/",(req, res) => {
  res.send("Hello, MongoDB is Connected!");
});

// Import Database Connection
require("./db");

const itemhistoryRoutes = require("./routes/ItemhistoryRoute")
const inventoryRoutes = require("./routes/inventoryRoute");


app.use("/api/inventory", inventoryRoutes);
app.use("/api/inventory", itemhistoryRoutes);


// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
