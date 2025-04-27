const express = require('express');
const { upload } = require('../../cartconfig/multer.js');
const authSeller = require('../../middlewares/authSeller.js');
const { addProduct, changeStock, productById, productList } = require('../../controller/cart/productController.js');

const productRouter = express.Router();

productRouter.post('/add', upload.array(["images"]), authSeller, addProduct);
productRouter.get('/list', productList)
productRouter.get('/id', productById)
productRouter.post('/stock', changeStock)

module.exports = productRouter;