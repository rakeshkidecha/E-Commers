const express = require('express');
const categoryCtl = require('../controller/categoryCtl');
const router = express.Router();

router.get('/',categoryCtl.addCategory);

router.post('/insertCategory',categoryCtl.insertCategory);

router.get('/viewCategory',categoryCtl.viewCategory);

router.get('/changeCategoryStatus/:id/:status',categoryCtl.changeCategoryStatus);

router.get('/deleteCategory/:id',categoryCtl.deleteCategory);

router.post('/editCategory',categoryCtl.editCategory);

module.exports = router;