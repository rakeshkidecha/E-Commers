
const Category = require('../models/CategoryModel');
const SubCategory = require('../models/SubCategoryModel');
const ExtraCategory = require('../models/ExtraCategoryModel');
const Product = require('../models/ProductModel');
const {validationResult} = require('express-validator');
const path = require('path');
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');

module.exports.home = async(req,res)=>{
    try {
        const allCategory = await Category.find({status:true});
        const allSubCategory = await SubCategory.find({status:true});
        const allExCategory = await ExtraCategory.find({status:true});
        return res.render('userPanel/home',{
            allCategory,
            allSubCategory,
            allExCategory
        });
    } catch (err) {
        console.log(err);
        req.flash('error',"Something Wrong");
        return res.redirect('back');
    }
};

module.exports.shop = async(req,res)=>{
    try {
        const allCategory = await Category.find({status:true});
        const allSubCategory = await SubCategory.find({status:true});
        const allExCategory = await ExtraCategory.find({status:true});

        let allProduct = [];
        if(req.query.cat){
            allProduct = await Product.find({categoryId:req.query.cat})
        }else if(req.query.subCat){
            allProduct = await Product.find({subCategoryId:req.query.subCat})
        }else if(req.query.exCat){
            allProduct = await Product.find({extraCategoryId:req.query.exCat})
        }

        return res.render('userPanel/shop',{
            allCategory,
            allSubCategory,
            allExCategory,
            allProduct
        });
    } catch (err) {
        console.log(err);
        req.flash('error',"Something Wrong");
        return res.redirect('back');
    }
};


module.exports.viewDetail = async(req,res)=>{
    try {
        const allCategory = await Category.find({status:true});
        const allSubCategory = await SubCategory.find({status:true});
        const allExCategory = await ExtraCategory.find({status:true});
        const singleProduct = await Product.findById(req.params.id);
        const suggestProduct = await Product.find({subCategoryId:singleProduct.subCategoryId})
        return res.render('userPanel/viewDetail',{
            allCategory,
            allSubCategory,
            allExCategory,
            singleProduct,
            suggestProduct
        });
    } catch (err) {
        console.log(err);
        req.flash('error',"Something Wrong");
        return res.redirect('back');
    }
};

// user register 
module.exports.userRegister = async(req,res)=>{
    try {
        return res.render('userPanel/userRegister',{
            errors:null,
            oldValue:null
        });
    } catch (err) {
        console.log(err);
        req.flash('error',"Something Wrong");
        return res.redirect('back');
    }
};

module.exports.insertUser = async(req,res)=>{
    try {
        const errors  = validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors.mapped());
            return res.render('userPanel/userRegister',{
                errors:errors.mapped(),
                oldValue:req.body
            });
        }

        let imagePath = '';
        if(req.file){
            imagePath = User.imgPath+'/'+req.file.filename;
        }
        req.body.profileImage = imagePath;
        req.body.password = await bcrypt.hash(req.body.password,10);

        const addedUser = await User.create(req.body);
        if(addedUser){
            req.flash('success','You are Register Successfully');
            return res.redirect('/userRegister');
        }else{
            req.flash('error','Failed to Register');
            return res.redirect('/userRegister');
        }

    } catch (err) {
        req.flash('error',"Something Wrong");
        console.log(err);
        return res.redirect('/userRegister');
    }
};

module.exports.userLogin = async(req,res)=>{
    try {
        return res.render('userPanel/userLogin');
    } catch (err) {
        console.log(err);
        req.flash('error',"Something Wrong");
        return res.redirect('/userRegister');
    }
};

module.exports.checkUser =async(req,res)=>{
    try {
        req.flash('success','Login SuccessFully');
        return res.redirect('/');
    } catch (err) {
        console.log(err);
        req.flash('error',"Something Wrong");
        return res.redirect('/userRegister');
    }
};

module.exports.userLogout = async(req,res)=>{
    try {
        req.session.destroy((err)=>{
            if(err){
                return res.redirect('back');
            }
            return res.redirect('back');
        })
    } catch (err) {
        console.log(err);
        req.flash('error',"Something Wrong");
        return res.redirect('/userRegister');
    }
};