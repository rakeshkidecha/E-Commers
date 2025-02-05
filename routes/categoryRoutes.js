const express = require('express');
const categoryCtl = require('../controller/categoryCtl');
const router = express.Router();
const {check} = require('express-validator');
const Category = require('../models/CategoryModel');

router.get('/',categoryCtl.addCategory);

router.post('/insertCategory',[
    check('categoryName').notEmpty().withMessage('Category Name is required').custom(async value =>{
        const isExistCategory = await Category.findOne({categoryName:value});
        if(isExistCategory){
            throw new Error("this Category is already Exist");
        }
    }),
],categoryCtl.insertCategory);

router.get('/viewCategory',categoryCtl.viewCategory);

router.get('/changeCategoryStatus/:id/:status',categoryCtl.changeCategoryStatus);

router.get('/deleteCategory/:id',categoryCtl.deleteCategory);

router.post('/editCategory',categoryCtl.editCategory);

router.post('/deactiveAllCategory',categoryCtl.deactiveAllCategory);

router.post('/operandAllDactiveCategory',categoryCtl.operandAllDactiveCategory);

module.exports = router;