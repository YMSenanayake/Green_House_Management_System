require("dotenv").config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

// Initialize Express App
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3001', // Replace with your frontend URL
  credentials: true // Important for cookies/auth
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// Import Database Connection
require("./db");

const usersRoute = require("./routes/usersRoute");
const leaveRoute = require("./routes/leavesRoutes");
const attendanceInRoute = require("./routes/attendanceInRoutes");
const attendanceOutRoute = require("./routes/attendanceOutRoutes");
const forgotpasswordRoute=require("./routes/forgotpasswordRout.js");
const productRoute=require("./routes/productRoute.js");
const financialRoute=require("./routes/financialRoute.js");
const machineRoute=require("./routes/machineRoute");
const  userRouter  = require("./routes/cart/userRoute.js");
const  productRouter  = require("./routes/cart/productRoute.js");
const  cartRouter  = require("./routes/cart/cartRoute.js");
const  addressRouter  = require("./routes/cart/addressRoute.js");
const  orderRouter  = require("./routes/cart/orderRoute.js");

app.use("/api/users", usersRoute);
app.use("/api/leaves", leaveRoute);
app.use("/api/attendanceIn", attendanceInRoute);
app.use("/api/attendanceOut", attendanceOutRoute);
app.use("/api/resetpassword", forgotpasswordRoute);
app.use("/api/product", productRoute);
app.use("/api/financial", financialRoute);
app.use("/api/machines",machineRoute );

app.use('/api/cart/user', userRouter)
app.use('/api/cart/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

// Define Routes (Example)
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});