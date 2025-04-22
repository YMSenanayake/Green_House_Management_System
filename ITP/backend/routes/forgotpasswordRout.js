const express = require("express");
const router = express.Router();
const User = require('../models/employeModel/usersModel');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const nodemailer = require('nodemailer');

const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

// Middleware for parsing request body
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Inside forgotpasswordRoute.js
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.status(404).json({ error: "User Not Exists" });
    }
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "15m",
    });
    const link = `http://localhost:3000/api/resetpassword/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'oepmsystem@gmail.com',
        pass: 'uvym yofx swbz lbbg'
      }
    });
    
    var mailOptions = {
        from: 'oepmsystem@gmail.com', // Updated sender email
        to: email, // Send to the user's email address from request
        subject: 'Password Reset',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 5px;">
            <h2 style="color: #65a30d; text-align: center;">Password Reset Request</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${link}" style="background-color: #65a30d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            </div>
            <p>This link will expire in 15 minutes for security reasons.</p>
            <p>If you didn't request a password reset, you can ignore this email.</p>
            <p>Thanks,<br>Your Support Team</p>
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
            <p style="font-size: 12px; color: #666; text-align: center;">If the button doesn't work, copy and paste this link into your browser: ${link}</p>
          </div>
        `  
      };
             
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    // Send JSON response
    res.json({ status: "Reset link sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  // Your logic for handling reset password here
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index.ejs", { email: verify.email ,status: "notverified"});
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
});

router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
   
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: password,
        },
      }
    );

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
});

module.exports = router;
