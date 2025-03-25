const User = require("../../models/employeModel/usersModel");

// Register User
const registerUser = async (req, res) => {
  const { fullName, email, phone, password, imageurl } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(200).json({ message: "This email already used", success: false });
    }

    const newUser = new User({ fullName, email, phone, password, imageurl });
    await newUser.save();
    return res.status(200).json({ message: "User Registered Successfully!", success: true });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid Credentials" });
    }

    const tempUser = {
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      imageurl: user.imageurl,
      _id: user._id,
    };

    return res.status(200).json({ success: true, user: tempUser, message: "User login successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong", error });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

// Get Single User
const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    return res.status(200).json({ status: "Employee is fetched", user });
  } catch (error) {
    return res.status(400).json({ status: "Error with fetch employee", message: error });
  }
};

// Update User
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { fullName, email, phone, role, imageurl, password } = req.body;

  const updatedUser = { fullName, email, phone, role, imageurl, password };

  try {
    await User.findByIdAndUpdate(userId, updatedUser);
    return res.status(200).json({ status: "User updated" });
  } catch (error) {
    return res.status(400).json({ status: "Error with update user", message: error });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ status: "User deleted" });
  } catch (error) {
    return res.status(400).json({ status: "Error with delete user", message: error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};