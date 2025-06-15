const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controller/emplyee/userControler");

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getallusers", getAllUsers);
router.post("/getuser/:id", getUserById);
router.put("/updateuser/:id", updateUser);
router.delete("/delete/:id", deleteUser);

module.exports = router;