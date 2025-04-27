const express = require('express');
const authUser = require('../../middlewares/authUser.js');
const { getAllOrders, getUserOrders, placeOrderCOD, placeOrderStripe } = require('../../controller/cart/orderController.js');
const authSeller = require('../../middlewares/authSeller.js');

const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD)
orderRouter.get('/user', authUser, getUserOrders)
orderRouter.get('/seller', authSeller, getAllOrders)
orderRouter.post('/stripe', authUser, placeOrderStripe)

module.exports = orderRouter;