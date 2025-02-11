const mongoose = require('mongoose');

const BrandSchema = mongoose.Schema({
    brandName :{
        type:String,
        required:true
    },
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
    productIds:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
    }],
    status:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

const Brand = mongoose.model('Brand',BrandSchema);
module.exports = Brand;