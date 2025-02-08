const mongoose = require('mongoose');

const TypeSchema = mongoose.Schema({
    typeName :{
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
    status:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

const Type = mongoose.model('Type',TypeSchema);
module.exports = Type;