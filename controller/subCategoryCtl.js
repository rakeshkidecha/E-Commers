const Category = require('../models/CategoryModel');
const SubCategory = require('../models/SubCategoryModel');


module.exports.addSubCategory = async (req,res)=>{
    try {   
        const allCategory = await Category.find({status:true});
        return res.render('subCategory/addSubCategory',{
            allCategory,
            errors:null,
            oldValue : null
        });
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.insertSubCategory = async (req,res)=>{
    try {
        const addedSubCategory = await SubCategory.create(req.body);
        if(addedSubCategory){
            const singleCategory = await Category.findById(addedSubCategory.categoryId);
            singleCategory.subCategoryIds.push(addedSubCategory._id);
            await Category.findByIdAndUpdate(singleCategory._id,singleCategory);

            req.flash('success',"Sub Category Added Successfully");
            console.log("Sub Category Added Successfully")
            return res.redirect('/subCategory');
        }else{
            req.flash('error',"Faild to add sub category");
            console.log("Faild to add sub category")
            return res.redirect('/subCategory');
        }
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/subCategory');
    }
}

module.exports.viewSubCategory = async(req,res)=>{
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

        const allSubCategory = await SubCategory.find({
            ...(date && {createdAt:{$gte:new Date(new Date(date).setHours(0,0,0,0)),$lte:new Date(new Date(date).setHours(23,59,59,999))}}),
            $or:[
                {subCategoryName:{$regex:searchValue,$options:'i'}},
            ]
        }).sort({...(sort&&{[sortType]:sort})}).populate('categoryId').exec();

        const allCategory = await Category.find({status:true});

        return res.render('subCategory/viewSubCategory',{
            allCategory,
            allSubCategory,
            searchValue,
            date,
            sort,
            sortType,
        });
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/subCategory');
    }
}
 
module.exports.changeSubCategoryStatus = async(req,res)=>{
    try {
        const {id,status} = req.params;

        const updatedSubCategory = await SubCategory.findByIdAndUpdate(id,{status:status});
        if(updatedSubCategory){
            req.flash('success',"Sub Category Status Updated");
            console.log("Sub Category Status Updated");
            return res.redirect('back');
        } else{
            req.flash('error',"Failed to Change Status of Sub Category");
            console.log("Failed to Change Status of Sub Category");
            return res.redirect('back');
        }

    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/subCategory');
    }
}

module.exports.deleteSubCategory = async(req,res)=>{
    try {
        const deletedSubCategory = await SubCategory.findByIdAndDelete(req.params.id);
        if(deletedSubCategory){
            const singleCategory = await Category.findById(deletedSubCategory.categoryId);
            singleCategory.subCategoryIds.splice(singleCategory.subCategoryIds.indexOf(deletedSubCategory.categoryId),1);
            await Category.findByIdAndUpdate(singleCategory._id,singleCategory);
            req.flash('success',"Sub Category Deleted");
            console.log("Sub Category Deleted");
            return res.redirect('back');
        }else{
            req.flash('error',"Failed to Delete Sub Category");
            console.log("Failed to Delete Sub Category");
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/subCategory');
    }
}

module.exports.editSubCategory = async(req,res)=>{
    try {

        const updatedSubCategory = await SubCategory.findByIdAndUpdate(req.body.id,req.body);
        if(updatedSubCategory){
            const singleCategory = await Category.findById(updatedSubCategory.categoryId);
            singleCategory.subCategoryIds.splice(singleCategory.subCategoryIds.indexOf(updatedSubCategory.categoryId),1);
            await Category.findByIdAndUpdate(singleCategory._id,singleCategory);
            
            const newCategory = await Category.findById(req.body.categoryId);
            newCategory.subCategoryIds.push(updatedSubCategory._id);
            await Category.findByIdAndUpdate(newCategory._id,newCategory);

            req.flash('success',"Sub Category Updated");
            console.log("Sub Category Updated");
            return res.redirect('back');
        }else{
            req.flash('error',"Failed to Update Sub Category");
            console.log("Failed to Update Sub Category");
            return res.redirect('back');
        }
        
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/subCategory');
    }
}

module.exports.deactiveAllSubCategory = async (req,res)=>{
    try {
        const updateManySubCategory = await SubCategory.updateMany({_id:{$in:req.body.catIds}},{status:false});
        if(updateManySubCategory){
            req.flash('success',"Deactive all Selected Sub Category");
            console.log("Deactive all Selected Sub Category");
            return res.redirect('back');
        }else{
            req.flash('error',"Failed to Deactive all Selected Sub Category");
            console.log("Failed to Deactive all Selected Sub Category");
            return req.redirect('back');
        }
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/subCategory');
    }
}

module.exports.operandAllDactiveSubCategory = async (req,res)=>{
    try {

        if(req.body.activeAll){
            const updateManySubCategory = await SubCategory.updateMany({_id:{$in:req.body.catIds}},{status:true});
            if(updateManySubCategory){
                req.flash('success',"Active all Selected Sub Category");
                console.log("Active all Selected Sub Category");
                return res.redirect('back');
            }else{
                req.flash('error',"Failed to Active all Selected Sub Category");
                console.log("Failed to Active all Selected Sub Category");
                return res.redirect('back');
            }
        }else{
            const deactiveAllSubCategory = await SubCategory.find({_id:{$in:req.body.catIds}});

            const deletedSubCategory = await SubCategory.deleteMany({_id:{$in:req.body.catIds}});
            if(deletedSubCategory){
                deactiveAllSubCategory.map(async (item)=>{
                    const singleCategory = await Category.findById(item.categoryId);
                    singleCategory.subCategoryIds.splice(singleCategory.subCategoryIds.indexOf(item.categoryId),1);
                    await Category.findByIdAndUpdate(singleCategory._id,singleCategory);
                });

                req.flash('success',"Delete all Selected Sub Category");
                console.log("Delete all Selected Sub Category");
                return res.redirect('back');
            }else{
                req.flash('error',"Failed to Delete all Selected Sub Category");
                console.log("Failed to Delete all Selected Sub Category");
                return res.redirect('back');
            }
        }
        
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/subCategory');
    }
}