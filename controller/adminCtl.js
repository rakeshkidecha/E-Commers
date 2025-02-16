const Admin = require('../models/AdminModel');
const path = require('path');
const fs = require('fs')
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const nodemailer = require('nodemailer');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKeyjsasds');
const Category = require('../models/CategoryModel');
const SubCategory = require('../models/SubCategoryModel');
const ExtraCategory = require('../models/ExtraCategoryModel');
const Type = require('../models/TypeModel');
const Brand = require('../models/BrandModel');
const Product = require('../models/ProductModel');


module.exports.dashboard = async (req,res)=>{
    try {

        const totalCategory = await Category.find({status:true}).countDocuments();
        const totalSubCategory = await SubCategory.find({status:true}).countDocuments();
        const totalExtraCategory = await ExtraCategory.find({status:true}).countDocuments();
        const totalType = await Type.find({status:true}).countDocuments();
        const totalBrand = await Brand.find({status:true}).countDocuments();
        const totalProduct = await Product.find({status:true}).countDocuments();

        return res.render('admin/dashboard',{
            totalCategory,
            totalSubCategory,
            totalExtraCategory,
            totalType,
            totalBrand,
            totalProduct
        });
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.addAdmin = async (req,res)=>{
    try {   
        return res.render('admin/addAdmin',{
            errors:null,
            oldValue : null
        });
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.insertAdmin = async (req,res)=>{
    try {
        const result = validationResult(req);
        if(!result.isEmpty()){
            return res.render('admin/addAdmin',{
                errors:result.mapped(),
                oldValue : req.body
            });
        }

        let imagePath = '';
        if(req.file){
            imagePath = Admin.imgPath+'/'+req.file.filename;
        }
        req.body.admin_image = imagePath;
        req.body.name = req.body.fName+' '+req.body.lName;
        req.body.email = req.body.email.toLowerCase();
        req.body.password = await bcrypt.hash(req.body.password,saltRounds);
        
        const addedAdmin = await Admin.create(req.body);
        if(addedAdmin){
            req.flash('success',"Admin Added Successfully");
            console.log("Admin Added Successfully");
            return res.redirect('/admin/addAdmin');
        }else{
            req.flash('error',"Faild to add admin");
            console.log("Faild to add admin");
            return res.redirect('/admin/addAdmin');
        }

    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/admin/addAdmin');
    }
}

module.exports.viewAdmin = async (req,res)=>{
    try {

        let searchValue ='';
        let date,sort,sortType,page=0,perPageData = 3;

        if(req.query.searchValue){
            searchValue = req.query.searchValue;
        }
        
        if(req.query.date){
            date = new Date(req.query.date);
        }

        if(req.query.page){
            page = req.query.page
        }
        
        if(req.query.sort && req.query.sortType){
            sort = parseInt(req.query.sort);
            sortType = req.query.sortType;
        }
        

        const allAdmin = await Admin.find({
            ...(date && {createdAt:{$gte:new Date(new Date(date).setHours(0,0,0,0)),$lte:new Date(new Date(date).setHours(23,59,59,999))}}),
            $or:[
                {name:{$regex:searchValue,$options:'i'}},
                {email:{$regex:searchValue.trim(),$options:'i'}},
                {hobby:{$regex:searchValue,$options:'i'}},
                {gender:{$regex:searchValue.trim(),$options:'i'}},
                {city:{$regex:searchValue.trim(),$options:'i'}},
            ]
        }).sort({...(sort&&{[sortType]:sort})}).skip(perPageData*page).limit(perPageData);

        const totalData = await Admin.find({
            ...(date && {createdAt:{$gte:new Date(new Date(date).setHours(0,0,0,0)),$lte:new Date(new Date(date).setHours(23,59,59,999))}}),
            $or:[
                {name:{$regex:searchValue,$options:'i'}},
                {email:{$regex:searchValue.trim(),$options:'i'}},
                {hobby:{$regex:searchValue,$options:'i'}},
                {gender:{$regex:searchValue.trim(),$options:'i'}},
                {city:{$regex:searchValue.trim(),$options:'i'}},
            ]
        }).countDocuments();

        const totalPage = Math.ceil(totalData/perPageData);

        return res.render('admin/viewAdmin',{
            allAdmin,
            searchValue,
            date,
            sort,
            sortType,
            page:parseInt(page),
            totalPage
        });
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}


module.exports.deleteAdmin = async (req,res)=>{
    try {
        const adminData = await Admin.findById(req.params.id);
        
        try {
            const deletedPath = path.join(__dirname,'..',adminData.admin_image);
            await fs.unlinkSync(deletedPath);
        } catch (err) {
            req.flash('error',"Image not found")
            console.log("Image not found")
        }

        const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
        if(deletedAdmin){
            console.log("Admin Deleted Successfully");
            req.flash('success',"Admin Deleted Successfully");
            return res.redirect('back');
        }else{
            req.flash('error',"faild to delete admin");
            console.log("faild to delete admin");
            return res.redirect('back');
        }

    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.changeAdminStatus = async(req,res)=>{
    try {
        const changedSatatus = await Admin.findByIdAndUpdate(req.params.id,{status:req.params.status});
        if(changedSatatus){
            console.log("Admin Status Changed Successfully");
            req.flash('success',"Admin Status Changed Successfully");
            return res.redirect('back');
        }else{
            console.log("faild to change admin status");
            req.flash('error',"faild to change admin status");
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

// update admin 
module.exports.updateAdmin =async (req,res)=>{
    try {
        const adminData = await Admin.findById(req.params.id);
        return res.render('admin/editAdmin',{adminData});
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.editAdmin = async (req,res)=>{
    try {
        const adminData = await Admin.findById(req.body.id);

        if(req.file){
            try {
                const deletedPath = path.join(__dirname,'..',adminData.admin_image);
                await fs.unlinkSync(deletedPath);
            } catch (err) {
                req.flash('error',"Image not Founded")
                console.log("Image not Founded");
            }

            let newImagePath = Admin.imgPath+'/'+req.file.filename;
            req.body.admin_image = newImagePath;

        }else{
            req.body.admin_image = adminData.admin_image;
        }

        req.body.name = req.body.fName+' '+req.body.lName;
        console.log(req.body.name.split(' '));

        const updatedAdmin = await Admin.findByIdAndUpdate(req.body.id,req.body);
        if(updatedAdmin){
            console.log("Admin Data Updated");
            req.flash('success',"Admin Data Updated");
            return res.redirect('/admin/viewAdmin');
        }else{
            console.log("faild to update admin");
            req.flash('error',"faild to update admin");
            return res.redirect('back');
        }

    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.changePassword = async(req,res)=>{
    try {
        return res.render('admin/changePassword',{id:req.params.id});
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.checkChnagePassword = async (req,res)=>{
    try {
        const adminData = await Admin.findById(req.body.id);

        if(!await bcrypt.compare(req.body.currentPassword,adminData.password)){
            console.log("Current Password not match");
            req.flash('error',"Current Password not match");
            return res.redirect('back');
        }

        if(req.body.newPassword == req.body.currentPassword){
            console.log("New Password and Current Password is same, try anothor");
            req.flash('error',"New Password and Current Password is same, try anothor");
            return res.redirect('back');
        }

        if(req.body.newPassword == req.body.confirmPassword){
            const newPassword = await bcrypt.hash(req.body.newPassword,saltRounds);
            const updatedAdmin = await Admin.findByIdAndUpdate(req.body.id,{password:newPassword});
            if(updatedAdmin){
                console.log("Admin Password Updated");
                req.flash('success',"Admin Password Updated");
                req.session.destroy((err)=>{
                    if(err){
                        console.log(err);
                        return res.redirect('back');
                    }
                    return res.redirect('/admin');
                })
            }
        }else{
            console.log("New Password And Comfirm password is not match");
            req.flash('error',"New Password And Comfirm password is not match");
            return res.redirect('back');
        }

    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

// login system 
module.exports.login = async (req,res)=>{
    try {
        return res.render('loginSystem/login');
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.chekLogin = async (req,res)=>{
    try {
         req.flash('success',"Login successfully");
        return res.redirect('/admin/dashboard');
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.adminLogOut = async (req,res)=>{
    try {
        req.session.destroy((err)=>{
            if(err){
                console.log(err);
                return res.redirect('back');
            }
            return res.redirect('/admin');
        })
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.checkEmail = async (req,res)=>{
    try {
        return res.render('loginSystem/checkEmail');
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.verifyEmail = async(req,res)=>{
    try {
        const isExistEmail = await Admin.find({email:req.body.email}).countDocuments();   

        if(isExistEmail != 1){
            console.log("Invalid Email");
            req.flash('error','Invalid Email')
            return res.redirect('back');
        }

        const adminData = await Admin.findOne({email:req.body.email});

        let OTP = Math.floor(Math.random()*10000);

        while(OTP.toString().length != 4){
            console.log(OTP);
            OTP = Math.floor(Math.random()*10000);
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
              user: "kidecharakesh2002@gmail.com",
              pass: "geeifzuqeavqkgfx",
            },
          });


          const info = await transporter.sendMail({
            from: 'kidecharakesh2002@gmail.com', // sender address
            to: adminData.email, // list of receivers
            subject: "Verification OTP", // Subject line
            html: `<p> Your varification otp id <b>${OTP}</b></p>`, // html body
          });


          console.log("Message sent: %s", info.messageId);

          res.cookie('verifivationOtp',cryptr.encrypt(JSON.stringify(OTP)),{maxAge:30*1000});
          res.cookie('email',cryptr.encrypt(JSON.stringify(adminData.email)));

          return res.redirect('/admin/checkOtp')

    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.checkOtp = async (req,res)=>{
    try {

        let isExistOtp = true;
        if(!req.cookies.verifivationOtp){
            isExistOtp = false;
        }

        const email = JSON.parse(cryptr.decrypt(req.cookies.email));
        return res.render('loginSystem/checkOtp',{email,isExistOtp});
        
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.verifyOtp = async (req,res)=>{
    try {

        if(!req.cookies.verifivationOtp){
            req.flash('error',"Otp will not send or expire");
            return res.redirect('back');
        }

        let verifivationOtp = JSON.parse(cryptr.decrypt(req.cookies.verifivationOtp))

        if(verifivationOtp == req.body.otp){
            res.clearCookie('verifivationOtp');
            return res.redirect('/admin/forgetPassword');
        }else{
            console.log("Otp not match")
            req.flash('error',"Otp Not Match");
            return res.redirect('back');
        }

    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.forgetPassword = async (req,res)=>{
    try {
        if(!req.cookies.email){
            return res.redirect('/admin');
        }

        return res.render('loginSystem/forgetPassword');
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.verifyNewPassword = async (req,res)=>{
    try {
        const email = JSON.parse(cryptr.decrypt(req.cookies.email))
        const adminData = await Admin.findOne({email:email});

        if(req.body.newPassword != req.body.confirmPassword){
            req.flash('error',"New And Confirm Password not match");
            return res.redirect('back');
        }

        const newPassword = await bcrypt.hash(req.body.newPassword,saltRounds);
        const updatedAdmin = await Admin.findByIdAndUpdate(adminData.id,{password:newPassword});

        if(updatedAdmin){
            req.flash('success',"Password Updated");
            res.clearCookie('email');
            return res.redirect('/admin');
        }else{
            req.flash('error',"Falid to Forget Password");
            return res.redirect('back')
        }

        
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}