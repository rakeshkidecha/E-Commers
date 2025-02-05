const mongoose = require('mongoose');

const SubCategorySchema = mongoose.Schema({
    subCategoryName :{
        type:String,
        required:true
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    extraCategoryIds:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ExtraCategory'
    }],
    status:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

const SubCategory = mongoose.model('SubCategory',SubCategorySchema);
module.exports = SubCategory;