const Admin = require('../models/AdminModel');
const path = require('path');
const fs = require('fs')

module.exports.dashboard = async (req,res)=>{
    try {
        return res.render('admin/dashboard');
    } catch (err) {
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.addAdmin = async (req,res)=>{
    try {   
        return res.render('admin/addAdmin');
    } catch (err) {
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.insertAdmin = async (req,res)=>{
    try {
        let imagePath = '';
        if(req.file){
            imagePath = Admin.imgPath+'/'+req.file.filename;
        }
        req.body.admin_image = imagePath;
        req.body.name = req.body.fName+' '+req.body.lName;

        const addedAdmin = await Admin.create(req.body);
        if(addedAdmin){
            console.log("Admin Added Successfully");
            return res.redirect('back');
        }else{
            console.log("Faild to add admin");
            return res.redirect('back');
        }

    } catch (err) {
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.viewAdmin = async (req,res)=>{
    try {
        const allAdmin = await Admin.find();
        return res.render('admin/viewAdmin',{allAdmin});
    } catch (err) {
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}


module.exports.deleteAdmin = async (req,res)=>{
    try {
        const adminData = await Admin.findById(req.params.id);
        
        try {
            const deletedPath = path.join(__dirname,'..',adminData.admin_image);
            await fs.unlinkSync(deletedPath);
        } catch (err) {
            console.log("Image not found")
        }

        const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
        if(deletedAdmin){
            console.log("Admin Deleted Successfully");
            return res.redirect('back');
        }else{
            console.log("faild to delete admin");
            return res.redirect('back');
        }

    } catch (err) {
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

// update admin 
module.exports.updateAdmin =async (req,res)=>{
    try {
        const adminData = await Admin.findById(req.params.id);
        return res.render('admin/editAdmin',{adminData});
    } catch (err) {
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.editAdmin = async (req,res)=>{
    try {
        const adminData = await Admin.findById(req.body.id);

        if(req.file){
            try {
                const deletedPath = path.join(__dirname,'..',adminData.admin_image);
                await fs.unlinkSync(deletedPath);
            } catch (err) {
                console.log("Image not Founded");
            }

            let newImagePath = Admin.imgPath+'/'+req.file.filename;
            req.body.admin_image = newImagePath;

        }else{
            req.body.admin_image = adminData.admin_image;
        }

        req.body.name = req.body.fName+' '+req.body.lName;
        console.log(req.body.name.split(' '));

        const updatedAdmin = await Admin.findByIdAndUpdate(req.body.id,req.body);
        if(updatedAdmin){
            console.log("Admin Data Updated");
            return res.redirect('/viewAdmin');
        }else{
            console.log("faild to update admin");
            return res.redirect('back');
        }

    } catch (err) {
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

// login system 
module.exports.login = async (req,res)=>{
    try {
        return res.render('loginSystem/login');
    } catch (err) {
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.chekLogin = async (req,res)=>{
    try {
        console.log("dashboard")
        return res.redirect('/dashboard');
    } catch (err) {
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}