const express = require('express');
const authUser = require('../../middlewares/authUser.js');
const { addAddress, getAddress } = require('../../controller/cart/addressController.js');

const addressRouter = express.Router();

addressRouter.post('/add', authUser, addAddress);
addressRouter.get('/get', authUser, getAddress);

module.exports = addressRouter;