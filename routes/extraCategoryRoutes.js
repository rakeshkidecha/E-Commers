const express = require('express');
const extraCategoryCtl = require('../controller/extraCategoryCtl');
const router = express.Router();

router.get('/',extraCategoryCtl.addExtraCategory);

router.get('/getSubCategory/:catId',extraCategoryCtl.getSubCategory);

router.post('/insertExtraCategory',extraCategoryCtl.insertExtraCategory);

router.get('/viewExtraCategory',extraCategoryCtl.viewExtraCategory);

router.get('/changeExtraCategoryStatus/:id/:status',extraCategoryCtl.changeExtraCategoryStatus);

router.get('/deleteExtraCategory/:id',extraCategoryCtl.deleteExtraCategory);

router.get('/updateExtraCategory/:id',extraCategoryCtl.updateExtraCategory);

router.post('/editExtraCategory',extraCategoryCtl.editExtraCategory);

router.post('/deactiveAllExtraCategory',extraCategoryCtl.deactiveAllExtraCategory);

router.post('/operandAllDactiveExtraCategory',extraCategoryCtl.operandAllDactiveExtraCategory)

module.exports = router ;