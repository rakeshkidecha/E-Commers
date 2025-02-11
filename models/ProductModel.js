const mongoose = require('mongoose');

const imagePath = '/uploads/product';
const path = require('path');
const multer = require('multer');

const ProductSchame = mongoose.Schema({
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    subCategoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubCategory',
        required:true
    },
    extraCategoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ExtraCategory',
        required:true
    },
    typeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Type',
        required:true
    },
    brandId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Brand',
        required:true
    },
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    coverImage:{
        type:String,
        required:true
    },
    productImages:[{
        type:String,
        required:true
    }],
    description:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
},{timestamps:true});

const imageStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'..',imagePath));
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+'-'+Math.floor(Math.random()*1000000));
    }
})

ProductSchame.statics.uploadImage = multer({storage:imageStorage}).fields([
    {
        name:'coverImage',
        maxCount:1,
    },
    {
        name:'productImages',
        maxCount:4
    }
])
ProductSchame.statics.imgPath = imagePath;

const Product = mongoose.model('Product',ProductSchame);
module.exports = Product;
    