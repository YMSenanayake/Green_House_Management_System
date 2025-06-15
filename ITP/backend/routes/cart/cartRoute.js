const express = require("express");
const authUser = require("../../middlewares/authUser.js");
const  updateCart  = require("../../controller/cart/cartController.js");

const cartRouter = express.Router();

cartRouter.post('/update', authUser, updateCart)

module.exports = cartRouter;