require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");

// MongoDB Connection URL from .env file

const mongoURL = process.env.MONGO_URL || "mongodb+srv://yasirumadhusankasenanayake:yasiru@cluster0.wgoyhki.mongodb.net/?retryWrites=true&w=majority&appName=Cluste

mongoose.connect(mongoURL, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log("✅ MongoDB connection successful"))
.catch(err => console.error("❌ MongoDB connection error:", err));

module.exports = mongoose;
