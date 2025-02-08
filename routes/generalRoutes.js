const express = require('express');

const router = express.Router();

router.use('/',require('./adminRoutes'));
router.use('/category',require('./categoryRoutes'));
router.use('/subCategory',require('./subCategoryRoutes'));
router.use('/extraCategory',require('./extraCategoryRoutes'));
router.use('/type',require('./typeRoutes'));

module.exports = router;
