const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    categoryName :{
        type:String,
        required:true
    },
    subCategoryIds:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubCategory'
    }],
    status:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

const Category = mongoose.model('Category',CategorySchema);
module.exports = Category;