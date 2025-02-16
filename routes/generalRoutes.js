const express = require('express');
const passport = require('passport');
const router = express.Router();


router.use('/',require('./userPanelRoutes'));


router.use('/admin',require('./adminRoutes'));
router.use('/category',passport.checkLogin,require('./categoryRoutes'));
router.use('/subCategory',passport.checkLogin,require('./subCategoryRoutes'));
router.use('/extraCategory',passport.checkLogin,require('./extraCategoryRoutes'));
router.use('/type',passport.checkLogin,require('./typeRoutes'));
router.use('/brand',passport.checkLogin,require('./brandRoutes'));
router.use('/product',passport.checkLogin,require('./productRoutes'));

module.exports = router;
