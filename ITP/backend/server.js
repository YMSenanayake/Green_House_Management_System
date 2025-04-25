const express = require("express");
const cors = require("cors");

// Initialize app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
require("./db");

// Mount only the machine route
app.use("/api/machines", require("./Routes/machineRoute"));

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
