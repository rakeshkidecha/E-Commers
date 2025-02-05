const express = require('express');
const subCategoryCtl = require('../controller/subCategoryCtl');
const router  = express.Router();

router.get('/',subCategoryCtl.addSubCategory);

router.post('/insertSubCategory',subCategoryCtl.insertSubCategory);

router.get('/viewSubCategory',subCategoryCtl.viewSubCategory);

router.get('/changeSubCategoryStatus/:id/:status',subCategoryCtl.changeSubCategoryStatus);

router.get('/deleteSubCategory/:id',subCategoryCtl.deleteSubCategory);

router.post('/editSubCategory',subCategoryCtl.editSubCategory);

router.post('/deactiveAllSubCategory',subCategoryCtl.deactiveAllSubCategory);

router.post('/operandAllDactiveSubCategory',subCategoryCtl.operandAllDactiveSubCategory);

module.exports = router;