const mongoose = require('mongoose');

const ExtraCategorySchema = mongoose.Schema({
    extraCategoryName :{
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
    typeIds:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Type'
    }],
    brandIds:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Brand'
    }],
    status:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

const ExtraCategory = mongoose.model('ExtraCategory',ExtraCategorySchema);
module.exports = ExtraCategory;