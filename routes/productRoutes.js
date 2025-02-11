const express = require('express');
const router = express.Router();
const productCtl = require('../controller/productCtl');
const Product = require('../models/ProductModel');

router.get('/',productCtl.addProduct);

router.get('/getSubCategory/:catId',productCtl.getSubCategory);

router.get('/getExtraCategory/:subCatId',productCtl.getExtraCategory);

router.get('/getBrandAndType/:exCatId',productCtl.getBrandAndType);

router.post('/insertProduct',Product.uploadImage,productCtl.insertProduct);

router.get('/viewProduct',productCtl.viewProduct);

router.get('/changeProductStatus/:id/:status',productCtl.changeProductStatus);

router.get('/deleteProduct/:id',productCtl.deleteProduct);

router.get('/updateProduct/:id',productCtl.updateProduct);

router.post('/editProduct',Product.uploadImage,productCtl.editProduct);

router.post('/deactiveAllProduct',productCtl.deactiveAllProduct);

router.post('/operandAllDactiveProduct',productCtl.operandAllDactiveProduct);

module.exports = router;