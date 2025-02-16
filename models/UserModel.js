const mongoose  = require('mongoose');

const path = require('path');
const imagePath = '/uploads/user';
const multer = require('multer');

const UserSchema = mongoose.Schema({
    username :{
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
    profileImage :{
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

UserSchema.statics.uploadAdminImage = multer({storage:imageStorage}).single('profileImage');
UserSchema.statics.imgPath = imagePath;


const User = mongoose.model('User',UserSchema);
module.exports = User;