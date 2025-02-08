const express = require('express');
const router= express.Router();
const typeCtl = require('../controller/typeCtl');

router.get('/',typeCtl.addType);

router.get('/getSubCategory/:catId',typeCtl.getSubCategory);

router.get('/getExtraCategory/:subCatId',typeCtl.getExtraCategory);

router.post('/insertType',typeCtl.insertType);

router.get('/viewType',typeCtl.viewType);

router.get('/changeTypeStatus/:id/:status',typeCtl.changeTypeStatus);

router.get('/deleteType/:id',typeCtl.deleteType);

router.get('/updateType/:id',typeCtl.updateType);

router.post('/editType',typeCtl.editType);

router.post('/deactiveAllType',typeCtl.deactiveAllType);

router.post('/operandAllDactiveType',typeCtl.operandAllDactiveType);

module.exports = router;