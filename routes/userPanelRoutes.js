const express = require('express');
const router = express.Router();
const userPanelCtl = require('../controller/userPanelCtl');
const User = require('../models/UserModel');
const {check} = require('express-validator');
const passport = require('passport');

router.get('/',userPanelCtl.home);

router.get('/shop',userPanelCtl.shop);

router.get('/viewDetail/:id',userPanelCtl.viewDetail);

router.get('/userRegister',userPanelCtl.userRegister);

router.post('/insertUser',User.uploadAdminImage,[
    check('username').notEmpty().withMessage('Username is required').isLength({min:2}).withMessage("Username must be minmun 2 Characters"),
    check('email').notEmpty().withMessage("Email is Required").isEmail().withMessage("Invalid Email").custom(async value=>{
        const isExistEmail = await User.findOne({email:value});
        if(isExistEmail){
            throw new Error("This Email is Already Exist");
        }
    }),
    check('password').notEmpty().withMessage("Password is required"),
    check('confirmPassword').notEmpty().withMessage("ConfirmPassword is required").custom(async (value,{req})=>{
        if(value !== req.body.password){
            throw new Error("Password and ConfirmPassword are not Match");
        }
    })
],userPanelCtl.insertUser);

router.get('/userLogin',userPanelCtl.userLogin);

router.post('/checkUser',passport.authenticate('userLogin',{failureRedirect:'/userLogin'}),userPanelCtl.checkUser);

router.get('/userLogout',userPanelCtl.userLogout)

module.exports = router;