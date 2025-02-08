const Category = require('../models/CategoryModel');
const SubCategory = require('../models/SubCategoryModel');
const ExtraCategory = require('../models/ExtraCategoryModel');
const Type = require('../models/TypeModel');
const ORM = require('../services/ORM');


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
        if(status=='true'){
            const singleSubcategory = await SubCategory.findById(id);
            const singleCategory = await Category.findById(singleSubcategory.categoryId);
            if(!singleCategory.status){
                req.flash('error',"The Category is not active");
                return res.redirect('back');
            }
        };

        const updatedSubCategory = await SubCategory.findByIdAndUpdate(id,{status:status});
        if(updatedSubCategory){
            if(status=='false'){
                ORM.opration.deactiveExCatBsOnSubCat(updatedSubCategory.extraCategoryIds);
            }
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
            // delete sub category id in category model 
            const singleCategory = await Category.findById(deletedSubCategory.categoryId);
            singleCategory.subCategoryIds.splice(singleCategory.subCategoryIds.indexOf(deletedSubCategory.categoryId),1);
            await Category.findByIdAndUpdate(singleCategory._id,singleCategory);

            // delete all ExtraCategory base on sub category 
            ORM.opration.deleteExCatBsOnSubCat(deletedSubCategory.extraCategoryIds);

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
        const allSubCategory = await SubCategory.find({_id:{$in:req.body.catIds}});
        const updateManySubCategory = await SubCategory.updateMany({_id:{$in:req.body.catIds}},{status:false});
        if(updateManySubCategory){
            allSubCategory.map((item)=>{
                ORM.opration.deactiveExCatBsOnSubCat(item.extraCategoryIds);
            })
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

        const deactiveAllSubCategory = await SubCategory.find({_id:{$in:req.body.catIds}}).populate('categoryId').exec();

        if(req.body.activeAll){

            const subCategoryIds = deactiveAllSubCategory.map((item)=>{
                console.log(item);
                if(item.categoryId.status){
                    return item._id;
                }
            });
            console.log(subCategoryIds);
            const updateManySubCategory = await SubCategory.updateMany({_id:{$in:subCategoryIds}},{status:true});
            if(updateManySubCategory){
                req.flash('success',"Active all Selected Sub Category Expect the subCateory Category not active");
                console.log("Active all Selected Sub Category");
                return res.redirect('back');
            }else{
                req.flash('error',"Failed to Active all Selected Sub Category");
                console.log("Failed to Active all Selected Sub Category");
                return res.redirect('back');
            }
        }else{

            const deletedSubCategory = await SubCategory.deleteMany({_id:{$in:req.body.catIds}});
            if(deletedSubCategory){
                deactiveAllSubCategory.map(async (item)=>{
                    // delete sub category id in category model 
                    const singleCategory = await Category.findById(item.categoryId);
                    singleCategory.subCategoryIds.splice(singleCategory.subCategoryIds.indexOf(item.categoryId),1);
                    await Category.findByIdAndUpdate(singleCategory._id,singleCategory);

                    // delete all ExtraCategory base on sub category 
                    ORM.opration.deleteExCatBsOnSubCat(item.extraCategoryIds);
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
        return res.redirect('back');
    }
}