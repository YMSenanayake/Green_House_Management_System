const express = require("express");
const cors = require("cors");

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
require("./db");


// Mount only the machine route
app.use("/api/machines", require("./Routes/machineRoute"));



const usersRoute = require("./routes/usersRoute");
const leaveRoute = require("./routes/leavesRoutes");
const attendanceInRoute = require("./routes/attendanceInRoutes");
const attendanceOutRoute = require("./routes/attendanceOutRoutes");
const forgotpasswordRoute=require("./routes/forgotpasswordRout.js")
const productRoute=require("./routes/productRoute.js")
const financialRoute=require("./routes/financialRoute.js")

app.use("/api/users", usersRoute);
app.use("/api/leaves", leaveRoute);
app.use("/api/attendanceIn", attendanceInRoute);
app.use("/api/attendanceOut", attendanceOutRoute);
app.use("/api/resetpassword", forgotpasswordRoute);
app.use("/api/product", productRoute);
app.use("/api/financial", financialRoute);

// Define Routes (Example)
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});

