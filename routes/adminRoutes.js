const express = require('express');
const adminCtl = require('../controller/adminCtl');
const router = express.Router();
const Admin = require('../models/AdminModel');
const passport = require('passport');
const {check} = require('express-validator');

router.get('/dashboard',passport.checkLogin,adminCtl.dashboard)

router.get('/addAdmin',passport.checkLogin,adminCtl.addAdmin);

router.get('/viewAdmin',passport.checkLogin,adminCtl.viewAdmin)

router.post('/insertAdmin',Admin.uploadAdminImage,[
    check('fName').notEmpty().withMessage('First Name is required').isLength({min:2}).withMessage("First name is expect minmum 2 catecter"),
    check('lName').notEmpty().withMessage('First Name is required').isLength({min:2}).withMessage("First name is expect minmum 2 catecter"),
    check('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Enter Valid email').custom(async value =>{
        const adminData = await Admin.findOne({email:value.toLowerCase()});
        if(adminData) {
            throw new Error("This Email is Already Used")
        }
    }),
    check('password').notEmpty().withMessage('Password is required').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,20}$/, "i").withMessage("Password must include one lowercase character, one uppercase character, a number, a special character and it's Length between 8-20 Catecter."),
    check('confirmPassword').notEmpty().withMessage('Confirm Password is Required').custom(async (value,{req})=>{
        if(value !== req.body.password) {
            throw new Error("Password and Confirm Password is not match");
        }
    }),
    check('gender').notEmpty().withMessage('Please Select your Gender'),
    check('hobby').notEmpty().withMessage('Please Select ateast one hobby'),
    check('city').notEmpty().withMessage('Please Select your City'),
    check('about').notEmpty().withMessage('About is Required').isLength({min:10}).withMessage("About is expect minmum 10 catecter")
],adminCtl.insertAdmin);

// delete admin Record 
router.get('/deleteAdmin/:id',adminCtl.deleteAdmin);

// update admin record 
router.get('/updateAdmin/:id',passport.checkLogin,adminCtl.updateAdmin);

router.post('/editAdmin',Admin.uploadAdminImage,adminCtl.editAdmin);

router.get('/changeAdminStatus/:id/:status',adminCtl.changeAdminStatus);

router.get('/changePassword/:id',passport.checkLogin,adminCtl.changePassword);

router.post('/checkChnagePassword',adminCtl.checkChnagePassword);

router.get('/adminLogOut',adminCtl.adminLogOut);

// admin login system 
router.get('/',adminCtl.login);

router.post('/chekLogin',passport.authenticate('adminLogin',{failureRedirect:'/admin'}),adminCtl.chekLogin);

router.get('/checkEmail',adminCtl.checkEmail);

router.post('/verifyEmail',adminCtl.verifyEmail);

router.get('/checkOtp',adminCtl.checkOtp);

router.post('/verifyOtp',adminCtl.verifyOtp);

router.get('/forgetPassword',adminCtl.forgetPassword);

router.post('/verifyNewPassword',adminCtl.verifyNewPassword);

module.exports = router;
