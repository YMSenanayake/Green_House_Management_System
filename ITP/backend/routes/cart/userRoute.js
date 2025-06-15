// import express from 'express';
const { isAuth, login, logout, register } =  require('../../controller/cart/userController.js') ;

const authUser = require('../../middlewares/authUser.js') ;
const express = require("express");
const userRouter = express.Router();

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/is-auth', authUser, isAuth)
userRouter.get('/logout', authUser, logout)

module.exports = userRouter;