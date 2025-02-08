const Category = require('../models/CategoryModel');
const SubCategory = require('../models/SubCategoryModel');
const ExtraCategory = require('../models/ExtraCategoryModel');
const Type = require('../models/TypeModel');
const ORM = require('../services/ORM');

module.exports.addExtraCategory = async(req,res)=>{
    try {
        const allCategory = await Category.find({status:true}); 
        return res.render('extraCategory/addExtraCategory',{
            allCategory,
            errors:null,
            oldValue:null
        })
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/subCategory');
    }
}

module.exports.getSubCategory = async(req,res)=>{
    try {
        const allSubCatBaseCat = await SubCategory.find({status:true,categoryId:req.params.catId});
        return res.json(allSubCatBaseCat);
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/subCategory');
    }
}

module.exports.insertExtraCategory = async (req,res)=>{
    try {
        const addedExtraCategory = await ExtraCategory.create(req.body);
        if(addedExtraCategory){
            const subCategory = await SubCategory.findById(addedExtraCategory.subCategoryId);
            subCategory.extraCategoryIds.push(addedExtraCategory._id);
            await SubCategory.findByIdAndUpdate(subCategory._id,subCategory);

            req.flash('success',"Extra Category Add Successfully");
            console.log("Extra Category Add Successfully")
            return res.redirect('/extraCategory')
        }else{
            req.flash('error',"Failed to add Extra Category");
            console.log("Failed to add Extra Category")
            return res.redirect('/extraCategory');
        }
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/extraCategory');
    }
}

module.exports.viewExtraCategory = async (req,res)=>{
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

        const allExtraCategory = await ExtraCategory.find({
            ...(date && {createdAt:{$gte:new Date(new Date(date).setHours(0,0,0,0)),$lte:new Date(new Date(date).setHours(23,59,59,999))}}),
            $or:[
                {extraCategoryName:{$regex:searchValue,$options:'i'}},
            ]
        }).sort({...(sort&&{[sortType]:sort})}).populate('categoryId').populate('subCategoryId').exec();



        return res.render('extraCategory/viewExtraCategory',{
            allExtraCategory,
            searchValue,
            date,
            sort,
            sortType,
        })

    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.changeExtraCategoryStatus = async(req,res)=>{
    try {
        const signleExtraCategory = await ExtraCategory.findById(req.params.id).populate('subCategoryId').exec();
        if(req.params.status == 'true'){
            if(!signleExtraCategory.subCategoryId.status){
                req.flash('error',"The subCategory not Active")
                return res.redirect('back');
            }
        }

        const changeStatus = await ExtraCategory.findByIdAndUpdate(req.params.id,{status:req.params.status});
        if(changeStatus){

            if(req.params.status == 'false'){
                ORM.opration.deativeTypeBsOnExCat(changeStatus.typeIds);
                ORM.opration.deativeBrandBsOnExCat(changeStatus.brandIds);
            }

            req.flash('success',"Extra Category Status Change Successfully");
            console.log("Extra Category Status Change Successfully")
            return res.redirect('back');
        }else{
            req.flash('error',"Failed to Chnage Extra Category Status");
            console.log("Failed to Chnage Extra Category Status");
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.deleteExtraCategory = async(req,res)=>{
    try {
        const deleteExtraCategory = await ExtraCategory.findByIdAndDelete(req.params.id);
        if(deleteExtraCategory){
            const subCategory = await SubCategory.findById(deleteExtraCategory.subCategoryId);
            subCategory.extraCategoryIds.splice(subCategory.extraCategoryIds.indexOf(deleteExtraCategory._id),1);
            await SubCategory.findByIdAndUpdate(subCategory._id,subCategory); 

            // delete type and Brand  who  related this sub category
            ORM.opration.deleteTypeBsOnExCat(deleteExtraCategory.typeIds);
            ORM.opration.deleteBrandBsOnExCat(deleteExtraCategory.brandIds);

            req.flash('success',"Extra Category Delete Successfully");
            console.log("Extra Category Delete Successfully");
            return res.redirect('back');
        }else{
            req.flash('error',"Failed to Delete Extra Category");
            console.log("Failed to Delete Extra Category");
            return res.redirect('back')
        }
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.updateExtraCategory = async(req,res)=>{
    try {
        const allCategory = await Category.find({status:true}); 
        const signleExtraCategory = await ExtraCategory.findById(req.params.id);
        const allSubCategory = await SubCategory.find({categoryId:signleExtraCategory.categoryId});
        return res.render('extraCategory/updateExtraCategory',{signleExtraCategory,allCategory,allSubCategory});
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.editExtraCategory = async(req,res)=>{
    try {
        const preExtraCategory = await ExtraCategory.findByIdAndUpdate(req.body.id,req.body);
        if(preExtraCategory){

            if(preExtraCategory.subCategoryId != req.body.subCategoryId){
                const subCategory = await SubCategory.findById(preExtraCategory.subCategoryId);
                subCategory.extraCategoryIds.splice(subCategory.extraCategoryIds.indexOf(preExtraCategory._id),1);
                await SubCategory.findByIdAndUpdate(subCategory._id,subCategory);

                const newSubCategory = await SubCategory.findById(req.body.subCategoryId);
                newSubCategory.extraCategoryIds.push(preExtraCategory._id);
                await SubCategory.findByIdAndUpdate(newSubCategory._id,newSubCategory);
            }

            req.flash('success',"Extra Category Update Successfully");
            console.log("Extra Category Update Successfully");
            return res.redirect('/extraCategory/viewExtraCategory');
        }else{
            req.flash('error',"Failed to Update Extra Category");
            console.log("Failed to Update Extra Category");
            return res.redirect('back');
        }
        
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.deactiveAllExtraCategory  = async (req,res)=>{
    try {
        const deactiveAllExtraCategory = await ExtraCategory.find({_id:{$in:req.body.catIds}})
        const deactiveExCat = await ExtraCategory.updateMany({_id:{$in:req.body.catIds}},{status:false});
        if(deactiveExCat){
            deactiveAllExtraCategory.map((item)=>{
                ORM.opration.deativeTypeBsOnExCat(item.typeIds);
                ORM.opration.deativeBrandBsOnExCat(item.brandIds);
            });

            req.flash('success',"All Selected Extra Category Deactivate");
            console.log("All Selected Extra Category Deactivate");
            return res.redirect('back');
        }else{
            req.flash('error',"Failed to Deactivate All Selected Extra Category");
            console.log("Failed to Deactivate All Selected Extra Category");
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.operandAllDactiveExtraCategory = async(req,res)=>{
    try {
        const deactiveAllExtraCategory = await ExtraCategory.find({_id:{$in:req.body.catIds}}).populate('subCategoryId').exec();
        if(req.body.activeAll){

            const extraCategoryIds = deactiveAllExtraCategory.map((item)=>{
                if(item.subCategoryId.status){
                    return item._id;
                }
            });


            const deactiveExtraCategory = await ExtraCategory.updateMany({_id:{$in:extraCategoryIds}},{status:true});
            if(deactiveExtraCategory){
                req.flash('success',"All Selected Extra Category Activate Expect if them Sub category are not active");
                console.log("All Selected Extra Category Activate");
                return res.redirect('back');
            }else{
                req.flash('error',"Failed to Activate All Selected Extra Category");
                console.log("Failed to Activate All Selected Extra Category");
                return res.redirect('back');
            }
        }else{
            if(deactiveAllExtraCategory){
                deactiveAllExtraCategory.map( async (item)=>{
                    const subCategory = await SubCategory.findById(item.subCategoryId);
                    subCategory.extraCategoryIds.splice(subCategory.extraCategoryIds.indexOf(item.id),1);
                    await SubCategory.findByIdAndUpdate(subCategory._id,subCategory);

                    
                    // delete type and brand who  related this sub category
                    ORM.opration.deleteTypeBsOnExCat(item.typeIds);
                    ORM.opration.deleteBrandBsOnExCat(item.brandIds);
                });
            }

            const deleteExtraCategory = await ExtraCategory.deleteMany({_id:{$in:req.body.catIds}});
            if(deleteExtraCategory){
                req.flash('success',"All Selected Extra Category Delete");
                console.log("All Selected Extra Category Delete");
                return res.redirect('back');
            }else{
                req.flash('error',"Failed to Delete All Selected Extra Category");
                console.log("Failed to Delete All Selected Extra Category");
                return res.redirect('back');
            }
        }
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back'); 
    }
}