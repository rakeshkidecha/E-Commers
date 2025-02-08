const express = require('express');
const router = express.Router();
const brandCtl = require('../controller/brandCtl');

router.get('/',brandCtl.addBrand);

router.get('/getSubCategory/:catId',brandCtl.getSubCategory);

router.get('/getExtraCategory/:subCatId',brandCtl.getExtraCategory);

router.post('/insertBrand',brandCtl.insertBrand);

router.get('/viewBrand',brandCtl.viewBrand);

router.get('/changeBrandStatus/:id/:status',brandCtl.changeBrandStatus);

router.get('/deleteBrand/:id',brandCtl.deleteBrand);

router.get('/updateBrand/:id',brandCtl.updateBrand);

router.post('/editBrand',brandCtl.editBrand);

router.post('/deactiveAllBrand',brandCtl.deactiveAllBrand);

router.post('/operandAllDactiveBrand',brandCtl.operandAllDactiveBrand);

module.exports = router;