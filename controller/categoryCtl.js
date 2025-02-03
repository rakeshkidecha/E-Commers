const Category = require('../models/CategoryModel');

module.exports.addCategory = async (req,res)=>{
    try {
        return res.render('category/addCategory');
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.insertCategory = async (req,res)=>{
    try {
        console.log(req.body);
        const addedCategory = await Category.create(req.body);
        if(addedCategory){
            req.flash('success',"Category Added Successfully");
            console.log('Category Added Successfully')
            return res.redirect('back')
        }else{
            req.flash('success',"faild to add category");
            console.log('faild to add category')
            return res.redirect('back')
        }

    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.viewCategory = async (req,res)=>{
    try {

        let searchValue ='';
        let date,sort,sortType;

        if(req.query.searchValue){
            searchValue = req.query.searchValue;
        }
        
        if(req.query.date){
            date = new Date(req.query.date);
        }
        
        if(req.query.sort && req.query.sortType){
            sort = parseInt(req.query.sort);
            sortType = req.query.sortType;
        }


        const allCategory = await Category.find({
            ...(date && {createdAt:{$gte:new Date(new Date(date).setHours(0,0,0,0)),$lte:new Date(new Date(date).setHours(23,59,59,999))}}),
            $or:[
                {categoryName:{$regex:searchValue,$options:'i'}},
            ]
        }).sort({...(sort&&{[sortType]:sort})});

        return res.render('category/viewCategory',{
            allCategory,
            searchValue,
            date,
            sort,
            sortType,
        });
        
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.changeCategoryStatus = async (req,res)=>{
    try {

        const {id,status}= req.params;
        const categoryUpdateStatus = await Category.findByIdAndUpdate(id,{status:status});
        if(categoryUpdateStatus){
            req.flash('success',"Category Status Updated Successfully");
            console.log('Category Status Updated Successfully')
            return res.redirect('back');
        }else{
            req.flash('error',"faild to update category status");
            console.log('faild to update category status');
            return res.redirect('back');
        }

    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.deleteCategory = async (req,res)=>{
    try {
        const deleteCategory = await Category.findByIdAndDelete(req.params.id);
        if(deleteCategory){
            req.flash('success',"Category Deleted Successfully");
            console.log('Category Deleted Successfully')
            return res.redirect('back');
        }else{
            req.flash('error',"faild to delete category");
            console.log('faild to delete category');
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.editCategory = async(req,res)=>{
    try {
        const updatedCategory = await Category.findByIdAndUpdate(req.body.id,req.body);
        if(updatedCategory){
            req.flash('success',"Category Updated Successfully");
            console.log('Category Updated Successfully')
            return res.redirect('back');
        }else{
            req.flash('error',"faild to update category");
            console.log('faild to update category');
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}