const express = require('express');
const adminCtl = require('../controller/adminCtl');
const router = express.Router();
const Admin = require('../models/AdminModel');
const passport = require('passport');

router.get('/dashboard',adminCtl.dashboard)

router.get('/addAdmin',adminCtl.addAdmin);

router.get('/viewAdmin',adminCtl.viewAdmin)

router.post('/insertAdmin',Admin.uploadAdminImage,adminCtl.insertAdmin);

// delete admin Record 
router.get('/deleteAdmin/:id',adminCtl.deleteAdmin);

// update admin record 
router.get('/updateAdmin/:id',adminCtl.updateAdmin);

router.post('/editAdmin',Admin.uploadAdminImage,adminCtl.editAdmin);


// admin login system 
router.get('/',adminCtl.login);

router.post('/chekLogin',passport.authenticate('adminLogin',{failureRedirect:'/'}),adminCtl.chekLogin);

module.exports = router;
