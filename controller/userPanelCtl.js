
const Category = require('../models/CategoryModel');
const SubCategory = require('../models/SubCategoryModel');
const ExtraCategory = require('../models/ExtraCategoryModel');
const Product = require('../models/ProductModel');
const Type = require('../models/TypeModel');
const Brand = require('../models/BrandModel');
const {validationResult} = require('express-validator');
const path = require('path');
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const Cart = require('../models/CartModel');

async function getTotalQuantity(req){
    let totalQuantity = 0;
    if(req.user){
        const allCartItem = await Cart.find({userId:req.user._id});
        totalQuantity = allCartItem.reduce((a,b)=>{
            return a + b.quantity 
        },0);
    } 

    return totalQuantity;
}

module.exports.home = async(req,res)=>{
    try {
        if(req.query.search){
            return res.redirect('/shop/?search='+req.query.search)
        };

        const allCategory = await Category.find({status:true});
        const allSubCategory = await SubCategory.find({status:true});
        const allExCategory = await ExtraCategory.find({status:true});

       
        return res.render('userPanel/home',{
            allCategory,
            allSubCategory,
            allExCategory,
            search:null,
            totalQuantity:await getTotalQuantity(req)
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
        let search = '';
        if(req.query.search){
            search = req.query.search
        }
        let page = 0,perPageData = 2;
        if(req.query.page){
            page = req.query.page
        }

        res.locals.filter = {
            ...(req.query.cat&&{value:req.query.cat,name:'cat'}),
            ...(req.query.subCat&&{value:req.query.subCat,name:'subCat'}),
            ...(req.query.exCat&&{value:req.query.exCat,name:'exCat'}),
        }

        // for all product 
        const allProduct = await Product.find({
            status:true,
            ...(req.query.cat&&{categoryId:req.query.cat}),
            ...(req.query.subCat&&{subCategoryId:req.query.subCat}),
            ...(req.query.exCat&&{extraCategoryId:req.query.exCat}),
            ...(req.query.price ? 
                    typeof req.query.price=='string'?
                    {price:{$gte:req.query.price.split('-')[0],$lte:req.query.price.split('-')[1]}}
                    :{price:{$gte:req.query.price[0].split('-')[0],$lte:req.query.price[req.query.price.length - 1].split('-')[1]}}
                :{}),
            ...(req.query.type?
                    typeof req.query.type !='string'?
                    {typeId:{$in:req.query.type}}
                    :{typeId:{$in:req.query.type.split(',')}}
                :{}),
            ...(req.query.brand?
                    typeof req.query.brand !='string'?
                    {brandId:{$in:req.query.brand}}
                    :{brandId:{$in:req.query.brand.split(',')}}
                :{}),
            $or:[
                {title:{$regex:search,$options:'i'}}
            ]
        }).sort({...(req.query.sort&&req.query.sortType&&{[req.query.sortType]:parseInt(req.query.sort)})}).skip(perPageData*page).limit(perPageData);

        const allType =await Type.find({
            status:true,
            ...(req.query.cat&&{categoryId:req.query.cat}),
            ...(req.query.subCat&&{subCategoryId:req.query.subCat}),
            ...(req.query.exCat&&{extraCategoryId:req.query.exCat}),
        });

        // for product count 
        
        const totalProduct = await Product.find({
            status:true,
            ...(req.query.cat&&{categoryId:req.query.cat}),
            ...(req.query.subCat&&{subCategoryId:req.query.subCat}),
            ...(req.query.exCat&&{extraCategoryId:req.query.exCat}),
            ...(req.query.price ? 
                    typeof req.query.price=='string'?
                    {price:{$gte:req.query.price.split('-')[0],$lte:req.query.price.split('-')[1]}}
                    :{price:{$gte:req.query.price[0].split('-')[0],$lte:req.query.price[req.query.price.length - 1].split('-')[1]}}
                :{}),
            ...(req.query.type?
                    typeof req.query.type !='string'?
                    {typeId:{$in:req.query.type}}
                    :{typeId:{$in:req.query.type.split(',')}}
                :{}),
            ...(req.query.brand?
                    typeof req.query.brand !='string'?
                    {brandId:{$in:req.query.brand}}
                    :{brandId:{$in:req.query.brand.split(',')}}
                :{}),
            $or:[
                {title:{$regex:search,$options:'i'}}
            ]
        }).sort({...(req.query.sort&&req.query.sortType&&{[req.query.sortType]:parseInt(req.query.sort)})}).countDocuments();

        const allBrand =await Brand.find({
            status:true,
            ...(req.query.cat&&{categoryId:req.query.cat}),
            ...(req.query.subCat&&{subCategoryId:req.query.subCat}),
            ...(req.query.exCat&&{extraCategoryId:req.query.exCat}),
        });

        const forPriceRange = await Product.find({
            status:true,
            ...(req.query.cat&&{categoryId:req.query.cat}),
            ...(req.query.subCat&&{subCategoryId:req.query.subCat}),
            ...(req.query.exCat&&{extraCategoryId:req.query.exCat}),
        });



        let maxPrice =0;
        for(let i = 0 ;i<forPriceRange.length;i++){
            if(forPriceRange[i].price > maxPrice){
                maxPrice = forPriceRange[i].price
            }
        }
        const priceRange = Math.ceil(maxPrice/5);

        const totalPage = Math.ceil(totalProduct/perPageData);

        return res.render('userPanel/shop',{
            allCategory,
            allSubCategory,
            allExCategory,
            allProduct,
            allBrand,
            allType,
            priceRange,
            price : req.query.price,
            type:req.query.type,
            brand:req.query.brand,
            search,
            page : parseInt(page),
            totalPage,
            totalQuantity:await getTotalQuantity(req)
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
            suggestProduct,
            search:null,
            totalQuantity:await getTotalQuantity(req)
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


// add to cart 
module.exports.addToCart = async(req,res)=>{
    try {
        const isExistProduct = await Cart.findOne({userId:req.user._id,productId:req.params.id});
        if(isExistProduct){
            const updateCart = await Cart.findByIdAndUpdate(isExistProduct._id,{quantity:isExistProduct.quantity + 1});
            if(updateCart){
                req.flash('success',"Product add to Cart")
                return res.redirect('back');
            }else{
                req.flash('error',"Failed to Product add into Cart")
                return res.redirect('back');
            }
        }else{
            const newCartItem = {
                productId : req.params.id,
                userId : req.user._id,
            };

            const addedCart = await Cart.create(newCartItem);
            if(addedCart){
                req.flash('success',"Product add to Cart")
                return res.redirect('back');
            }else{
                req.flash('error',"Failed to Product add into Cart")
                return res.redirect('back');
            }
        }
    } catch (err) {
        console.log(err);
        req.flash('error',"Something Wrong");
        return res.redirect('back');
    }
};

module.exports.viewCart = async(req,res)=>{
    try {
        const allCategory = await Category.find({status:true});
        const allSubCategory = await SubCategory.find({status:true});
        const allExCategory = await ExtraCategory.find({status:true});

        const allCartItem = await Cart.find({userId:req.user._id}).populate('productId').exec();

        return res.render('userPanel/viewCart',{
            allCategory,
            allSubCategory,
            allExCategory,
            search:null,
            totalQuantity:await getTotalQuantity(req),
            allCartItem
        });
    } catch (err) {
        console.log(err);
        req.flash('error',"Something Wrong");
        return res.redirect('back');
    }
};

module.exports.quantityIncOrdec = async(req,res)=>{
    try {
        const cartItem = await Cart.findById(req.params.id);
        if(cartItem){
            if(req.params.value == 'inc'){
                const updateQuantity = await Cart.findByIdAndUpdate(req.params.id,{quantity:cartItem.quantity+1});
                if(updateQuantity){
                    req.flash('success',"Quantity Increase");
                    return res.redirect('back');
                }
            }else if(req.params.value == 'dec'){
                if(cartItem.quantity <= 1){
                    await Cart.findByIdAndDelete(req.params.id);
                    req.flash('success',"If Quantity 0, So it will be removed");
                    return res.redirect('back');
                };
                const updateQuantity = await Cart.findByIdAndUpdate(req.params.id,{quantity:cartItem.quantity-1});
                if(updateQuantity){
                    req.flash('success',"Quantity Decrease");
                    return res.redirect('back');
                }
            }
        }else{
            req.flash('error',"Quantity not Updated");
            return res.redirect('back')
        }
    } catch (err) {
        console.log(err);
        req.flash('error',"Something Wrong");
        return res.redirect('back');
    }
};

module.exports.removeCartItem = async(req,res)=>{
    try {
        const removedItem = await Cart.findByIdAndDelete(req.params.id);
        if(removedItem){
            req.flash('success',"Removed Cart Item");
            return res.redirect('back')
        }else{
            req.flash('error',"Failed to Removed Cart Item");
            return res.redirect('back');
        }
    } catch (err) {
        console.log(err);
        req.flash('error',"Something Wrong");
        return res.redirect('back');
    }
};

module.exports.checkOut = async(req,res)=>{
    try {
        const allCategory = await Category.find({status:true});
        const allSubCategory = await SubCategory.find({status:true});
        const allExCategory = await ExtraCategory.find({status:true});

        const allCartItem = await Cart.find({userId:req.user._id}).populate('productId').exec();
        let totalPrice = 0
        allCartItem.map((item)=>{
            totalPrice += (item.productId.price - (item.productId.price*item.productId.discount)/100)*item.quantity
        });

        return res.render('userPanel/checkOut',{
            allCategory,
            allSubCategory,
            allExCategory,
            search:null,
            totalQuantity:await getTotalQuantity(req),
            totalPrice : Math.ceil(totalPrice)
        });
    } catch (err) {
        console.log(err);
        req.flash('error',"Something Wrong");
        return res.redirect('back');
    }
}