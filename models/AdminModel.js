const mongoose  = require('mongoose');

const path = require('path');
const imagePath = '/uploads/admin';
const multer = require('multer');

const AdminSchema = mongoose.Schema({
    name :{
        type:String,
        required:true
    },
    email :{
        type:String,
        required:true
    },
    password :{
        type:String,
        required:true
    },
    gender :{
        type:String,
        required:true
    },
    hobby :{
        type:Array,
        required:true
    },
    city :{
        type:String,
        required:true
    },
    about :{
        type:String,
        required:true
    },
    admin_image :{
        type:String,
        required:true
    },
    status:{
        type : Boolean,
        default:true
    }
},{timestamps:true});

const imageStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'..',imagePath));
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+'-'+Date.now());
    }
})

AdminSchema.statics.uploadAdminImage = multer({storage:imageStorage}).single('admin_image');
AdminSchema.statics.imgPath = imagePath;


const Admin = mongoose.model('Admin',AdminSchema);
module.exports = Admin;